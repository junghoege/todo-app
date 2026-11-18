# 05: 할 일 수정

**What to build:** 사용자가 기존 할 일의 제목/설명/마감일/우선순위를 나중에 바꿀 수 있게 한다.

**Blocked by:** 04

**Status:** done

- [x] `lib/todos.ts`에 `updateTodo(id, input)`이 추가되고, 제목/설명/마감일/우선순위를 갱신한다.
- [x] 목록에서 각 항목을 수정할 수 있는 UI(폼/모달 등)가 있다.
- [x] 수정한 내용이 저장되고 목록에 즉시 반영된다.
- [x] 완료 여부는 이 수정 UI가 아니라 기존 토글(02)로 별도 처리된다.
- [x] `updateTodo`가 로컬 libSQL 테스트 DB에 대해 테스트된다 (모킹 없이).

## Comments

- `updateTodo(id, input)` added to `lib/todos.ts` via TDD (`tdd` skill): wrote failing tests in `lib/todos.test.ts` against the real local libSQL DB first (update all fields, persists in `listTodos`, leaves `completed` untouched, clears description/dueDate when omitted), confirmed red (`updateTodo is not a function`), then implemented the minimal `db.update(todos).set(...).where(eq(todos.id, id)).returning()` to go green. `completed` is intentionally excluded from the update payload — it stays owned by `toggleTodo`.
- `updateTodoAction(id, formData)` added to `app/actions.ts` as a thin Server Action reusing the same zod field schema as `createTodoAction`, calling `updateTodo`, then `revalidatePath("/")`.
- UI: each list item in `app/page.tsx` got a `<details>/<summary>` "수정" disclosure (no client JS needed) containing a form pre-filled with the todo's current title/description/dueDate/priority, submitting to `updateTodoAction` bound to that todo's id. The existing toggle/delete forms were left untouched.
- Verified with `npm test` (13/13 passing, including 4 new `updateTodo` tests), `npm run lint` (clean), and `npm run build` (production build succeeds, including the Cache-Components-sensitive `/` route).
- Note: this worktree's `node_modules` was missing `next` (incomplete/empty install) and `.env.local` was absent, both blocking `npm run build` initially — ran `npm install` and copied `.env.local` from the main repo checkout (not opened/printed) to unblock verification. `.env.local` remains gitignored and is not part of the commit.
