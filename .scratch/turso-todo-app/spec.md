# Turso 기반 Todo 앱

Status: ready-for-agent

## Problem Statement

사용자는 할 일을 기록하고 관리할 수 있는 앱이 필요하지만, 로컬에만 저장되면 기기를 바꾸거나 배포 환경이 재시작될 때 데이터가 사라진다. 현재 저장소는 `create-next-app`의 기본 스캐폴드만 있고(`app/layout.tsx`, `app/page.tsx`가 아직 보일러플레이트 그대로), 할 일을 추가/관리할 수 있는 기능이 전혀 없다.

## Solution

Next.js App Router 위에 로그인 없는 단일 사용자용 Todo 리스트를 만든다. 할 일 데이터는 Drizzle ORM을 통해 Turso(클라우드 호스팅 libSQL/SQLite)에 저장되어, 어디서 접속하든 동일한 데이터를 본다. 추가·수정·완료 토글·삭제는 모두 Server Actions로 처리하고, 목록은 "미완료 우선 → 우선순위 높은 순 → 마감일 빠른 순 → 동률이면 생성순" 기준으로 항상 같은 규칙으로 정렬되어 보인다.

## User Stories

1. As a 사용자, I want 할 일 목록을 볼 수 있는 기능, so that 내가 해야 할 일들을 한눈에 파악할 수 있다.
2. As a 사용자, I want 제목만 입력해서 빠르게 할 일을 추가하는 기능, so that 간단한 작업도 빠르게 기록할 수 있다.
3. As a 사용자, I want 할 일을 추가할 때 설명을 선택적으로 입력하는 기능, so that 필요한 경우에만 세부 내용을 남길 수 있다.
4. As a 사용자, I want 할 일에 마감일을 선택적으로 지정하는 기능, so that 기한이 있는 작업을 구분할 수 있다.
5. As a 사용자, I want 할 일에 우선순위(낮음/보통/높음)를 지정하는 기능, so that 중요한 일을 먼저 처리할 수 있다.
6. As a 사용자, I want 우선순위를 따로 고르지 않으면 "보통"이 기본값으로 적용되는 기능, so that 매번 우선순위를 고르지 않아도 된다.
7. As a 사용자, I want 할 일을 완료로 표시하는 기능, so that 끝낸 일을 더 이상 신경 쓰지 않아도 된다.
8. As a 사용자, I want 완료 표시를 다시 취소하는 기능, so that 실수로 완료 처리한 항목을 되돌릴 수 있다.
9. As a 사용자, I want 기존 할 일의 제목/설명/마감일/우선순위를 수정하는 기능, so that 상황이 바뀌어도 할 일 정보를 최신으로 유지할 수 있다.
10. As a 사용자, I want 할 일을 완전히 삭제하는 기능, so that 더 이상 필요 없는 항목을 목록에서 제거할 수 있다.
11. As a 사용자, I want 미완료 항목이 완료 항목보다 항상 위에 보이는 기능, so that 아직 해야 할 일에 집중할 수 있다.
12. As a 사용자, I want 같은 완료 상태 안에서는 우선순위가 높은 항목이 먼저 보이는 기능, so that 중요한 일부터 처리할 수 있다.
13. As a 사용자, I want 우선순위가 같으면 마감일이 빠른 항목이 먼저 보이는 기능, so that 급한 일을 놓치지 않을 수 있다.
14. As a 사용자, I want 정렬 기준이 모두 같으면 먼저 추가한 항목이 먼저 보이는 기능, so that 목록 순서가 예측 가능하게 유지된다.
15. As a 사용자, I want 제목을 비워둔 채 추가/수정하려고 하면 에러를 보는 기능, so that 의미 없는 빈 항목이 생기지 않는다.
16. As a 사용자, I want 마감일이 지난 미완료 항목을 시각적으로 구분해서 보는 기능, so that 놓친 마감일을 바로 알아챌 수 있다.
17. As a 사용자, I want 할 일이 하나도 없을 때 빈 상태 안내 문구를 보는 기능, so that 앱이 정상 작동 중임을 알 수 있다.
18. As a 사용자, I want 내가 추가한 할 일이 새로고침하거나 나중에 다시 방문해도 그대로 남아있는 기능, so that 작업 내용을 잃어버리지 않는다.
19. As a 사용자, I want 로그인 없이 바로 할 일을 관리할 수 있는 기능, so that 번거로운 가입 절차 없이 바로 쓸 수 있다.
20. As a 사용자, I want 우선순위를 미리 정해진 값(낮음/보통/높음) 중에서만 고르는 기능, so that 오타나 제각각인 값 없이 일관된 우선순위를 유지할 수 있다.
21. As a 사용자, I want 추가/수정/완료/삭제 같은 조작이 끝나면 목록이 바로 최신 상태로 보이는 기능, so that 조작이 제대로 됐는지 바로 확인할 수 있다.

## Implementation Decisions

- **인증 범위**: 로그인/세션 없음. 단일 사용자 전제로, `todos` 테이블에 `user_id` 같은 소유자 컬럼을 두지 않는다.
- **데이터 접근 계층 (`lib/todos.ts`)**: Server Actions와 DB 사이의 유일한 시임. `listTodos()`, `createTodo(input)`, `updateTodo(id, input)`, `toggleTodo(id)`, `deleteTodo(id)`를 내보낸다. 정렬 로직(완료 여부 → 우선순위 → 마감일 → 생성일)은 이 모듈의 쿼리 안에 구현한다 (우선순위 텍스트 값을 정렬 가능한 순서로 매핑하는 `CASE` 식 또는 동등한 표현 사용).
- **DB 클라이언트**: `@libsql/client`로 Turso에 연결하는 싱글턴 클라이언트를 만들고, `TURSO_DATABASE_URL`/`TURSO_AUTH_TOKEN` 환경변수를 `.env.local`에서 읽는다. `.env.local`은 직접 열람/출력하지 않는다 (이미 `.gitignore`의 `.env*` 규칙에 포함되어 git 추적 대상이 아님을 확인함).
- **ORM / 스키마**: Drizzle ORM으로 `todos` 테이블 스키마를 정의한다. 컬럼: `id`(PK, auto), `title`(text, not null), `description`(text, nullable), `dueDate`(text/date, nullable), `priority`(text, not null, `'low' | 'medium' | 'high'` 중 하나, 기본값 `'medium'`), `completed`(boolean, not null, 기본값 false), `createdAt`(timestamp, not null, 기본값 현재 시각).
- **마이그레이션**: `drizzle-kit generate`로 SQL 마이그레이션 파일을 생성해 저장소에 커밋하고, `drizzle-kit migrate`(또는 동등한 적용 스크립트)로 Turso DB에 적용한다. 스키마 변경 이력이 저장소에 남는다.
- **변경 작업 처리**: 추가/수정/완료 토글/삭제는 모두 Server Actions(`'use server'`)로 구현한다. 각 액션은 입력을 zod 스키마로 검증(제목 필수/공백 불가, `priority` enum, `dueDate` 형식)한 뒤 `lib/todos.ts`의 대응 함수를 호출하고, 끝나면 목록 경로를 `revalidatePath`로 갱신한다. 별도의 REST API 라우트는 두지 않는다.
- **목록 UI**: 정렬/필터 토글 같은 사용자 조작 UI는 두지 않는다 — `listTodos()`가 반환하는 고정된 순서를 그대로 렌더링한다. 마감일이 지났고 완료되지 않은 항목은 시각적으로 구분되게 표시한다(예: 강조 스타일).
- **삭제**: 하드 삭제(SQL `DELETE`)만 지원한다. `deletedAt` 같은 소프트 삭제 컬럼은 두지 않는다.
- **수정**: 제목/설명/마감일/우선순위를 모두 수정 가능하게 한다. 완료 여부는 토글 액션으로 별도 처리한다.
- **스타일링**: 기존 Tailwind v4 CSS-first 설정(`app/globals.css`의 `@theme inline`)과 `tsconfig.json`의 `@/*` 경로 별칭을 그대로 사용한다. 새 Tailwind 설정 파일이나 추가 UI 라이브러리는 도입하지 않는다.

## Testing Decisions

- 좋은 테스트의 기준: `lib/todos.ts`가 반환하는 데이터(내용, 정렬 순서, 필드 값)만 검증하고, 내부적으로 어떤 SQL이 생성되는지 같은 구현 디테일은 검증하지 않는다.
- 테스트 대상 모듈: `lib/todos.ts` 하나뿐이다. Server Actions(`app/actions.ts`)와 UI 컴포넌트는 얇은 래퍼로 유지하고 별도로 테스트하지 않는다.
- 테스트 DB: `@libsql/client`로 만든 로컬 파일 또는 인메모리 libSQL 인스턴스를 테스트마다 새로 만들고, 프로덕션과 동일한 Drizzle 마이그레이션 파일을 적용한 뒤 그 위에서 `lib/todos.ts` 함수를 직접 호출해 검증한다. DB 클라이언트나 Drizzle 쿼리를 모킹하지 않는다.
- 프로젝트 내 선례: 없음 (그린필드). 이 기능 구현과 함께 테스트 러너(Vitest 권장 — TypeScript/ESM 기반 Next.js 프로젝트와 궁합이 좋음)를 새로 도입해야 한다.

## Out of Scope

- 사용자 인증, 다중 사용자, 공유/협업 기능
- 휴지통, 소프트 삭제, 복구 기능
- 목록 필터링, 수동 정렬, 검색
- 카테고리/태그/여러 할 일 목록 관리
- 알림, 반복 할 일, 첨부파일
- 모바일 전용 UI, 오프라인 지원

## Further Notes

- 모든 주요 설계 결정(인증 범위, ORM 선택, 변경 작업 처리 방식, 필드 구성, 기본 정렬, 수정 기능 포함 여부, 우선순위 값 구성, 마이그레이션 방식, 삭제 방식)은 이 대화에서 grilling 라운드를 통해 사용자가 직접 확인했으며, 모두 추천된 기본값으로 확정되었다.
- `@libsql/client`는 이미 `package.json` 의존성에 포함되어 있었으나, `lib/`나 `db/` 디렉터리, 스키마, Server Actions는 아직 전혀 만들어지지 않은 상태에서 이 스펙을 작성했다.
- `GLOSSARY.md`/`docs/adr/`는 아직 저장소에 없다. 구현 중 "할 일(Todo)", "우선순위" 같은 용어나 Drizzle/Turso 선택 같은 결정이 확정되면 `/domain-modeling`으로 기록하는 것을 고려한다.
