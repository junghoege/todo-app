"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createTodo, deleteTodo, toggleTodo } from "@/lib/todos";

const createTodoSchema = z.object({
  title: z.string().trim().min(1),
});

export async function createTodoAction(formData: FormData) {
  const parsed = createTodoSchema.safeParse({ title: formData.get("title") });
  if (!parsed.success) return;

  await createTodo({ title: parsed.data.title });
  revalidatePath("/");
}

export async function toggleTodoAction(id: number) {
  await toggleTodo(id);
  revalidatePath("/");
}

export async function deleteTodoAction(id: number) {
  await deleteTodo(id);
  revalidatePath("/");
}
