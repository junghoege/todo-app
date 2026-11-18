"use server";

import { revalidatePath } from "next/cache";
import { createTodo, deleteTodo, toggleTodo, updateTodo } from "@/lib/todos";
import { firstTodoInputError, todoInputSchema } from "@/lib/todo-input";

export type TodoActionState = { error: string } | null;

function parseTodoFormData(formData: FormData) {
  return todoInputSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description") || null,
    dueDate: formData.get("dueDate") || null,
    priority: formData.get("priority") || undefined,
  });
}

export async function createTodoAction(
  _prevState: TodoActionState,
  formData: FormData,
): Promise<TodoActionState> {
  const parsed = parseTodoFormData(formData);
  if (!parsed.success) {
    return { error: firstTodoInputError(parsed.error) };
  }

  await createTodo(parsed.data);
  revalidatePath("/");
  return null;
}

export async function updateTodoAction(
  id: number,
  _prevState: TodoActionState,
  formData: FormData,
): Promise<TodoActionState> {
  const parsed = parseTodoFormData(formData);
  if (!parsed.success) {
    return { error: firstTodoInputError(parsed.error) };
  }

  await updateTodo(id, parsed.data);
  revalidatePath("/");
  return null;
}

export async function toggleTodoAction(id: number) {
  await toggleTodo(id);
  revalidatePath("/");
}

export async function deleteTodoAction(id: number) {
  await deleteTodo(id);
  revalidatePath("/");
}
