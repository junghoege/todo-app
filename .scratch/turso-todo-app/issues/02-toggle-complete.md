# 02: 완료 토글

**What to build:** 사용자가 목록에서 할 일을 완료로 표시하거나 다시 미완료로 되돌릴 수 있게 한다.

**Blocked by:** 01

**Status:** done

- [x] `lib/todos.ts`에 `toggleTodo(id)`가 추가되고, 완료 상태를 반전시킨다.
- [x] 목록의 각 항목에 완료 상태를 토글할 수 있는 체크박스(또는 동등한 컨트롤)가 있다.
- [x] 토글 후 목록이 즉시 최신 상태로 반영된다 (`revalidatePath` 등).
- [x] 완료 처리한 항목을 다시 미완료로 되돌릴 수 있다.
- [x] `toggleTodo`가 로컬 libSQL 테스트 DB에 대해 테스트된다 (모킹 없이).

## Comments

- 실제 Turso DB에 대해 `next dev`로 토글 on/off를 직접 POST해 확인함 (완료 시 line-through + "완료 취소" 라벨로 바뀌는 것, 다시 토글 시 되돌아오는 것 모두 확인).
