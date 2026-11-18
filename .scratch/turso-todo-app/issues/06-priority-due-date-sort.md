# 06: 우선순위/마감일 기준 정렬 확장

**What to build:** 목록이 "미완료 우선 → 우선순위 높은순 → 마감일 빠른순 → 동률이면 생성순"으로 항상 정렬되어 보이게 한다.

**Blocked by:** 02, 04

**Status:** done

- [x] `lib/todos.ts`의 `listTodos()`가 완료 여부를 1차 기준으로 정렬한다 (미완료가 위).
- [x] 같은 완료 상태 안에서는 우선순위가 높은 항목이 먼저 온다.
- [x] 우선순위가 같으면 마감일이 빠른 항목(마감일 없는 항목보다 우선)이 먼저 온다.
- [x] 모든 기준이 동률이면 먼저 생성된 항목이 먼저 온다.
- [x] 정렬을 사용자가 바꿀 수 있는 UI 컨트롤은 추가하지 않는다 (고정 규칙).
- [x] 다양한 완료 상태/우선순위/마감일 조합에 대해 `listTodos()`의 반환 순서가 로컬 libSQL 테스트 DB에 대해 테스트된다 (모킹 없이).

## Comments

- TDD (red→green) against the existing local libSQL test DB in `lib/todos.test.ts`, no mocking, following the existing style (`beforeEach` clears `todos` via `db.delete(todos)`).
- Added a `describe("listTodos sort order", ...)` block with 5 vertical-slice tests: priority descending among incomplete todos, dueDate ascending when priority ties, null dueDate sorting last within a priority tier, createdAt as the final tiebreaker when priority+dueDate tie, and a combined completed/priority/dueDate scenario.
- Implementation change is confined to `lib/todos.ts`: `listTodos()`'s `orderBy` now chains `asc(todos.completed)`, a `priorityRank` SQL `CASE` expression (high=0, medium=1, low=2), a `dueDateNullsLast` SQL `CASE` expression (so NULL dueDates — which SQLite orders first by default on ASC — sort after any real date), `asc(todos.dueDate)`, then `asc(todos.createdAt)` as the final tiebreaker.
- Verified: `npm test` (14/14 passing, including the 6 pre-existing tests), `npm run lint` (clean), `npm run build` (succeeds, static/PPR output as before).
- No UI or Server Action changes; no new sort-control UI was added, per scope.
