# 03: 삭제

**What to build:** 사용자가 더 이상 필요 없는 할 일을 목록에서 완전히 제거할 수 있게 한다.

**Blocked by:** 01

**Status:** done

- [x] `lib/todos.ts`에 `deleteTodo(id)`가 추가되고, 해당 행을 하드 삭제(SQL `DELETE`)한다.
- [x] 목록의 각 항목에 삭제 버튼(또는 동등한 컨트롤)이 있다.
- [x] 삭제 후 해당 항목이 목록에서 즉시 사라진다.
- [x] 삭제된 항목은 복구 수단 없이 DB에서 완전히 제거된다 (휴지통/소프트 삭제 없음).
- [x] `deleteTodo`가 로컬 libSQL 테스트 DB에 대해 테스트된다 (모킹 없이).

## Comments

- 실제 Turso DB에 대해 `next dev`로 삭제를 직접 POST해 확인함: 삭제 후 목록이 즉시 빈 상태 안내로 바뀜.
