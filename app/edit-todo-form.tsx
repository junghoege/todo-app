"use client";

import { useActionState } from "react";
import type { Todo } from "@/lib/db/schema";
import type { TodoActionState } from "./actions";
import { TodoFields, TodoFormError } from "./todo-fields";

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
        <TodoFields
          defaultTitle={todo.title}
          defaultDescription={todo.description ?? ""}
          defaultDueDate={todo.dueDate ?? ""}
          defaultPriority={todo.priority}
          submitLabel="저장"
        />
        <TodoFormError error={state?.error} />
      </form>
    </details>
  );
}
