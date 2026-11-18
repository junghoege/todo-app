"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createTodo, deleteTodo, toggleTodo, updateTodo } from "@/lib/todos";

const todoFieldsSchema = {
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
};

const createTodoSchema = z.object(todoFieldsSchema);
const updateTodoSchema = z.object(todoFieldsSchema);

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

export async function updateTodoAction(id: number, formData: FormData) {
  const parsed = updateTodoSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description") || null,
    dueDate: formData.get("dueDate") || null,
    priority: formData.get("priority") || undefined,
  });
  if (!parsed.success) return;

  await updateTodo(id, parsed.data);
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
