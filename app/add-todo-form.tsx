"use client";

import { useActionState } from "react";
import { createTodoAction } from "./actions";

export function AddTodoForm() {
  const [state, formAction] = useActionState(createTodoAction, null);

  return (
    <form action={formAction} className="flex flex-col gap-2">
      <input
        type="text"
        name="title"
        placeholder="할 일을 입력하세요"
        defaultValue=""
        className="rounded border border-black/[.08] px-3 py-2 dark:border-white/[.145]"
      />
      <input
        type="text"
        name="description"
        placeholder="설명 (선택)"
        defaultValue=""
        className="rounded border border-black/[.08] px-3 py-2 dark:border-white/[.145]"
      />
      <div className="flex gap-2">
        <input
          type="date"
          name="dueDate"
          aria-label="마감일"
          defaultValue=""
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
      {state?.error && (
        <p className="text-sm text-red-600 dark:text-red-400" role="alert">
          {state.error}
        </p>
      )}
    </form>
  );
}
