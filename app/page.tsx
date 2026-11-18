import { Suspense } from "react";
import { listTodos } from "@/lib/todos";
import { createTodoAction, deleteTodoAction, toggleTodoAction } from "./actions";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-xl flex-1 flex-col gap-6 px-6 py-16">
      <h1 className="text-2xl font-semibold">할 일</h1>

      <form action={createTodoAction} className="flex gap-2">
        <input
          type="text"
          name="title"
          placeholder="할 일을 입력하세요"
          required
          className="flex-1 rounded border border-black/[.08] px-3 py-2 dark:border-white/[.145]"
        />
        <button
          type="submit"
          className="rounded bg-foreground px-4 py-2 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
        >
          추가
        </button>
      </form>

      <Suspense fallback={<TodoListFallback />}>
        <TodoList />
      </Suspense>
    </main>
  );
}

async function TodoList() {
  const items = await listTodos();

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
          className="flex items-center gap-3 rounded border border-black/[.08] px-3 py-2 dark:border-white/[.145]"
        >
          <form action={toggleTodoAction.bind(null, todo.id)}>
            <button
              type="submit"
              aria-label={todo.completed ? "완료 취소" : "완료로 표시"}
              className="flex h-5 w-5 shrink-0 items-center justify-center rounded border border-black/30 text-xs dark:border-white/30"
            >
              {todo.completed ? "✓" : ""}
            </button>
          </form>

          <span
            className={
              todo.completed
                ? "flex-1 text-black/40 line-through dark:text-white/40"
                : "flex-1"
            }
          >
            {todo.title}
          </span>

          <form action={deleteTodoAction.bind(null, todo.id)}>
            <button
              type="submit"
              className="text-sm text-black/60 hover:underline dark:text-white/60"
            >
              삭제
            </button>
          </form>
        </li>
      ))}
    </ul>
  );
}

function TodoListFallback() {
  return (
    <p className="text-sm text-black/40 dark:text-white/40">불러오는 중...</p>
  );
}
