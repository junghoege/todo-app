import { Suspense } from "react";
import { listTodos } from "@/lib/todos";
import {
  createTodoAction,
  deleteTodoAction,
  toggleTodoAction,
  updateTodoAction,
} from "./actions";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-xl flex-1 flex-col gap-6 px-6 py-16">
      <h1 className="text-2xl font-semibold">할 일</h1>

      <form action={createTodoAction} className="flex flex-col gap-2">
        <input
          type="text"
          name="title"
          placeholder="할 일을 입력하세요"
          required
          className="rounded border border-black/[.08] px-3 py-2 dark:border-white/[.145]"
        />
        <input
          type="text"
          name="description"
          placeholder="설명 (선택)"
          className="rounded border border-black/[.08] px-3 py-2 dark:border-white/[.145]"
        />
        <div className="flex gap-2">
          <input
            type="date"
            name="dueDate"
            aria-label="마감일"
            className="flex-1 rounded border border-black/[.08] px-3 py-2 dark:border-white/[.145]"
          />
          <select
            name="priority"
            defaultValue="medium"
            aria-label="우선순위"
            className="rounded border border-black/[.08] px-3 py-2 dark:border-white/[.145]"
          >
            <option value="low">낮음</option>
            <option value="medium">보통</option>
            <option value="high">높음</option>
          </select>
          <button
            type="submit"
            className="rounded bg-foreground px-4 py-2 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
          >
            추가
          </button>
        </div>
      </form>

      <Suspense fallback={<TodoListFallback />}>
        <TodoList />
      </Suspense>
    </main>
  );
}

function isOverdue(todo: { completed: boolean; dueDate: string | null }, todayStr: string) {
  return !todo.completed && !!todo.dueDate && todo.dueDate < todayStr;
}

async function TodoList() {
  const items = await listTodos();
  const todayStr = new Date().toISOString().slice(0, 10);

  if (items.length === 0) {
    return (
      <p className="text-sm text-black/60 dark:text-white/60">
        아직 할 일이 없습니다.
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-2">
      {items.map((todo) => (
        <li
          key={todo.id}
          className="flex flex-col gap-2 rounded border border-black/[.08] px-3 py-2 dark:border-white/[.145]"
        >
          <div className="flex items-start gap-3">
            <form action={toggleTodoAction.bind(null, todo.id)}>
              <button
                type="submit"
                aria-label={todo.completed ? "완료 취소" : "완료로 표시"}
                className="flex h-5 w-5 shrink-0 items-center justify-center rounded border border-black/30 text-xs dark:border-white/30"
              >
                {todo.completed ? "✓" : ""}
              </button>
            </form>

            <div className="flex flex-1 flex-col gap-1">
              <span
                className={
                  todo.completed
                    ? "text-black/40 line-through dark:text-white/40"
                    : undefined
                }
              >
                {todo.title}
              </span>

              {todo.description && (
                <span className="text-sm text-black/60 dark:text-white/60">
                  {todo.description}
                </span>
              )}

              <div className="flex gap-2 text-xs text-black/50 dark:text-white/50">
                <span>{PRIORITY_LABELS[todo.priority]}</span>
                {todo.dueDate && (
                  <span
                    className={
                      isOverdue(todo, todayStr)
                        ? "font-semibold text-red-600 dark:text-red-400"
                        : undefined
                    }
                  >
                    마감일: {todo.dueDate}
                    {isOverdue(todo, todayStr) && " (지남)"}
                  </span>
                )}
              </div>
            </div>

            <form action={deleteTodoAction.bind(null, todo.id)}>
              <button
                type="submit"
                className="text-sm text-black/60 hover:underline dark:text-white/60"
              >
                삭제
              </button>
            </form>
          </div>

          <details className="text-sm">
            <summary className="cursor-pointer text-black/60 hover:underline dark:text-white/60">
              수정
            </summary>
            <form
              action={updateTodoAction.bind(null, todo.id)}
              className="mt-2 flex flex-col gap-2"
            >
              <input
                type="text"
                name="title"
                defaultValue={todo.title}
                required
                className="rounded border border-black/[.08] px-3 py-2 dark:border-white/[.145]"
              />
              <input
                type="text"
                name="description"
                defaultValue={todo.description ?? ""}
                placeholder="설명 (선택)"
                className="rounded border border-black/[.08] px-3 py-2 dark:border-white/[.145]"
              />
              <div className="flex gap-2">
                <input
                  type="date"
                  name="dueDate"
                  defaultValue={todo.dueDate ?? ""}
                  aria-label="마감일"
                  className="flex-1 rounded border border-black/[.08] px-3 py-2 dark:border-white/[.145]"
                />
                <select
                  name="priority"
                  defaultValue={todo.priority}
                  aria-label="우선순위"
                  className="rounded border border-black/[.08] px-3 py-2 dark:border-white/[.145]"
                >
                  <option value="low">낮음</option>
                  <option value="medium">보통</option>
                  <option value="high">높음</option>
                </select>
                <button
                  type="submit"
                  className="rounded bg-foreground px-4 py-2 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
                >
                  저장
                </button>
              </div>
            </form>
          </details>
        </li>
      ))}
    </ul>
  );
}

const PRIORITY_LABELS: Record<string, string> = {
  low: "우선순위: 낮음",
  medium: "우선순위: 보통",
  high: "우선순위: 높음",
};

function TodoListFallback() {
  return (
    <p className="text-sm text-black/40 dark:text-white/40">불러오는 중...</p>
  );
}
