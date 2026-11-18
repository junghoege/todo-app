"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createTodo, deleteTodo, toggleTodo } from "@/lib/todos";

const createTodoSchema = z.object({
  title: z.string().trim().min(1),
  description: z
    .string()
    .trim()
    .min(1)
    .nullable()
    .optional()
    .transform((value) => value ?? null),
  dueDate: z
    .string()
    .trim()
    .min(1)
    .nullable()
    .optional()
    .transform((value) => value ?? null),
  priority: z.enum(["low", "medium", "high"]).default("medium"),
});

export async function createTodoAction(formData: FormData) {
  const parsed = createTodoSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description") || null,
    dueDate: formData.get("dueDate") || null,
    priority: formData.get("priority") || undefined,
  });
  if (!parsed.success) return;

  await createTodo(parsed.data);
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
