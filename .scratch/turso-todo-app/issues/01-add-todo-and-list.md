# 01: 제목만으로 할 일 추가 + 목록 보기

**What to build:** 사용자가 제목만 입력해 할 일을 추가하고, 추가한 할 일이 새로고침하거나 나중에 다시 방문해도 그대로 남아있는 목록으로 보이게 한다. 이 티켓에서 Drizzle 스키마/마이그레이션, Turso DB 클라이언트, `lib/todos.ts`(이 기능 전체의 유일한 테스트 시임 — `createTodo`/`listTodos`), Server Action, 추가 폼 + 목록 UI, 테스트 하네스(로컬 libSQL 인스턴스에 마이그레이션 적용 후 `lib/todos.ts` 직접 호출)까지 end-to-end로 갖춘다.

**Blocked by:** None (can start immediately)

**Status:** done

- [x] `todos` 테이블 스키마(`id`, `title`, `completed`, `createdAt`)가 Drizzle로 정의되고, `drizzle-kit generate`로 생성한 마이그레이션 파일이 저장소에 커밋되어 있다.
- [x] `TURSO_DATABASE_URL`/`TURSO_AUTH_TOKEN` 환경변수로 Turso에 연결하는 DB 클라이언트가 구성되어 있다 (`.env.local`은 열람/출력하지 않는다).
- [x] 사용자가 제목을 입력해 제출하면 할 일이 생성되고 목록에 나타난다.
- [x] 페이지를 새로고침하거나 다시 방문해도 추가한 할 일이 그대로 남아있다 (Turso에 영속화됨).
- [x] 완료되지 않은 항목이 위, 같은 완료 상태 안에서는 먼저 추가한 항목이 먼저 보이는 기초 정렬이 적용된다.
- [x] 할 일이 하나도 없을 때도 페이지가 에러 없이 렌더링된다.
- [x] `lib/todos.ts`의 `createTodo`/`listTodos`가 로컬 libSQL 테스트 DB(프로덕션과 동일한 마이그레이션 적용)에 대해 테스트되고, DB 클라이언트나 쿼리를 모킹하지 않는다.

## Comments

- 실제 Turso DB에 마이그레이션을 적용하고(`npm run db:migrate`), `next build`(Cache Components 대응을 위해 목록을 `<Suspense>`로 감쌈) 및 `next dev`로 실제 폼 제출(progressive-enhancement fallback 경로)까지 end-to-end로 검증함. 테스트용으로 추가했던 항목은 삭제해 DB를 정리함.
- `npm test`(vitest) 3개 테스트, `npm run lint`, `npm run build` 모두 통과.
