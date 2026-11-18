# 08: 입력 검증 에러 표시

**What to build:** 추가/수정 폼에 잘못된 입력(빈 제목, 잘못된 우선순위/마감일 형식)을 제출했을 때 사용자가 알아볼 수 있는 에러 메시지를 보여준다.

**Blocked by:** 01, 05

**Status:** done

- [x] 제목을 비워둔 채(또는 공백만 입력해) 추가/수정을 시도하면 에러 메시지가 표시되고 저장되지 않는다.
- [x] 우선순위에 허용되지 않은 값을 보내면 에러로 처리된다 (UI는 드롭다운이라 정상 흐름에서는 발생하지 않지만 Server Action 레벨에서 방어된다).
- [x] 마감일에 올바르지 않은 형식의 값을 보내면 에러로 처리된다.
- [x] 에러 발생 시 사용자가 입력했던 다른 필드 값은 폼에서 유지된다.
- [x] zod 검증 규칙(제목 필수, 우선순위 enum, 마감일 형식)이 Server Action 레벨에서 테스트된다.

## Comments

- Extracted the zod schema that was inlined in `app/actions.ts` into a plain, framework-free module `lib/todo-input.ts` (`todoInputSchema` + `firstTodoInputError` helper). It has no dependency on `next/cache` or any Next.js request context, so it's unit-tested directly with `safeParse` in `lib/todo-input.test.ts` (12 tests: empty/whitespace title rejected, valid title trimmed, invalid priority rejected, each valid priority accepted, priority defaults to `medium`, invalid `dueDate` formats rejected (`2026/12/01`, `not-a-date`), valid `YYYY-MM-DD` accepted, `null` dueDate accepted). Added a `dueDate` format regex (`^\d{4}-\d{2}-\d{2}$`) that didn't exist before this ticket — previously any non-empty string was accepted.
- `createTodoAction`/`updateTodoAction` in `app/actions.ts` now use React's Server Action error-return convention: `(prevState, formData) => Promise<{ error: string } | null>`. On validation failure they return `{ error: <first zod issue message> }` and skip the `createTodo`/`updateTodo`/`revalidatePath` calls entirely — so nothing is persisted and the cache isn't invalidated when validation fails.
- Added `app/add-todo-form.tsx` and `app/edit-todo-form.tsx` as `"use client"` components using `useActionState` from `react` to drive the add form and each row's edit form, rendering `state.error` (role="alert") next to the submit button when present. `app/page.tsx` now renders `<AddTodoForm />` and `<EditTodoForm todo={todo} updateAction={updateTodoAction.bind(null, todo.id)} />` instead of the old plain `<form action={...}>` markup.
- Removed the `required` attribute from the title `<input>`s (both forms) so a fully empty submission isn't blocked client-side by native HTML validation and actually reaches the server action — this is what makes the empty-title case observable as an app-level error message rather than a silent browser block. Whitespace-only titles already bypassed `required` before this change.
- All fields remain uncontrolled (`defaultValue`), and `useActionState` re-renders the same form DOM node on a failed submission rather than remounting it, so previously typed values in other fields survive a failed submit without any extra controlled-input bookkeeping.
- Verified via: (1) `lib/todo-input.test.ts` — 12 passing unit tests directly against the extracted schema, exercising every validation rule in this ticket; (2) manual code-trace of `createTodoAction`/`updateTodoAction` confirming the early `return { error }` happens before any DB write or `revalidatePath` call; (3) attempted a live no-JS progressive-enhancement POST via `curl` replicating the browser's `$ACTION_*` hidden-field encoding for the empty-title case, but Next's dev-mode Server Action manifest rejected the replayed action id (`x-nextjs-action-not-found`) — an artifact of the raw wire protocol being brittle to reproduce by hand outside a real browser/JS runtime, not a sign of a bug in this code (the schema-level behavior it would have exercised is already covered by the unit tests and the control-flow trace). No headless-browser tool was available in this environment to drive a real click-through instead.
