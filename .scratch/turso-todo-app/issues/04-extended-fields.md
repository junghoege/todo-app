# 04: 확장 필드 추가 (설명/마감일/우선순위)

**What to build:** 사용자가 할 일을 추가할 때 설명, 마감일, 우선순위를 선택적으로(우선순위는 기본값 포함) 지정하고, 목록에서 그 값을 확인할 수 있게 한다.

**Blocked by:** 01

**Status:** done

- [x] `todos` 테이블에 `description`(nullable), `dueDate`(nullable), `priority`(`'low' | 'medium' | 'high'`, not null, 기본값 `'medium'`) 컬럼을 추가하는 마이그레이션이 생성·커밋되어 있다.
- [x] 추가 폼에서 설명/마감일을 선택적으로 입력할 수 있고, 우선순위를 미리 정해진 세 값 중에서 고를 수 있다.
- [x] 우선순위를 고르지 않으면 "보통"이 기본값으로 저장된다.
- [x] 목록의 각 항목에서 설명/마감일/우선순위 값을 확인할 수 있다.
- [x] `createTodo`가 이 새 필드들을 받아 저장하는 것이 로컬 libSQL 테스트 DB에 대해 테스트된다 (모킹 없이).

## Comments

- `lib/db/schema.ts`: added `description` (nullable text), `dueDate` (nullable text, column `due_date`), `priority` (text enum `'low'|'medium'|'high'`, not null, default `'medium'`).
- Migration generated via `npm run db:generate` → `drizzle/0001_rainy_shiver_man.sql` (committed along with its `drizzle/meta` snapshot/journal updates), then applied to the real Turso DB via `npm run db:migrate`.
- `lib/todos.ts`: `createTodo` now accepts optional `description`, `dueDate`, `priority` and persists them (priority defaults to `'medium'` via the schema default when omitted).
- TDD (via the `tdd` skill) on `lib/todos.test.ts`: added a red test asserting `createTodo` persists `description`/`dueDate`/`priority` (failed first, since `createTodo` ignored the extra fields), then a red→green default-value test, then implemented the change — both now green alongside the full existing suite (9/9 passing).
- `app/actions.ts`: `createTodoSchema` extended with optional `description`/`dueDate` (trimmed, null when blank) and `priority` enum defaulting to `medium`; thin wrapper only, no new tests per the spec's testing decision.
- `app/page.tsx`: add form now has description text input, due-date date input, and a priority `<select>` (low/medium/high, defaulting to medium). Each list item now shows description (if present), a priority label, and due date (if present). No sorting/overdue-highlight changes made (out of scope — tickets 06/07).
- Verified: `npm test` (9/9 pass), `npm run lint` (clean), `npm run build` (succeeds, Cache Components prerender still streams the todo list via the existing `<Suspense>` boundary).
