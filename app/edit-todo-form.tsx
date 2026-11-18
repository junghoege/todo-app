"use client";

import { useActionState } from "react";
import type { Todo } from "@/lib/db/schema";
import type { TodoActionState } from "./actions";

export function EditTodoForm({
  todo,
  updateAction,
}: {
  todo: Todo;
  updateAction: (
    prevState: TodoActionState,
    formData: FormData,
  ) => Promise<TodoActionState>;
}) {
  const [state, formAction] = useActionState(updateAction, null);

  return (
    <details className="text-sm">
      <summary className="cursor-pointer text-black/60 hover:underline dark:text-white/60">
        수정
      </summary>
      <form action={formAction} className="mt-2 flex flex-col gap-2">
        <input
          type="text"
          name="title"
          defaultValue={todo.title}
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
        {state?.error && (
          <p className="text-sm text-red-600 dark:text-red-400" role="alert">
            {state.error}
          </p>
        )}
      </form>
    </details>
  );
}
