"use client";

import { useActionState } from "react";
import { createTodoAction } from "./actions";
import { TodoFields, TodoFormError } from "./todo-fields";

export function AddTodoForm() {
  const [state, formAction] = useActionState(createTodoAction, null);

  return (
    <form action={formAction} className="flex flex-col gap-2">
      <TodoFields titlePlaceholder="할 일을 입력하세요" submitLabel="추가" />
      <TodoFormError error={state?.error} />
    </form>
  );
}
