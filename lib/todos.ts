import { asc, eq, not, sql } from "drizzle-orm";
import { db } from "./db/client";
import { todos, type Todo } from "./db/schema";
import type { TodoInput } from "./todo-input";

const priorityRank = sql`case ${todos.priority} when 'high' then 0 when 'medium' then 1 when 'low' then 2 else 3 end`;
const dueDateNullsLast = sql`case when ${todos.dueDate} is null then 1 else 0 end`;

export async function listTodos(): Promise<Todo[]> {
  return db
    .select()
    .from(todos)
    .orderBy(
      asc(todos.completed),
      priorityRank,
      dueDateNullsLast,
      asc(todos.dueDate),
      asc(todos.createdAt),
    );
}

export async function createTodo(input: TodoInput): Promise<Todo> {
  const [created] = await db
    .insert(todos)
    .values({
      title: input.title,
      description: input.description ?? null,
      dueDate: input.dueDate ?? null,
      ...(input.priority ? { priority: input.priority } : {}),
    })
    .returning();
  return created;
}

export async function updateTodo(id: number, input: TodoInput): Promise<Todo> {
  const [updated] = await db
    .update(todos)
    .set({
      title: input.title,
      description: input.description ?? null,
      dueDate: input.dueDate ?? null,
      ...(input.priority ? { priority: input.priority } : {}),
    })
    .where(eq(todos.id, id))
    .returning();
  return updated;
}

export async function toggleTodo(id: number): Promise<Todo> {
  const [toggled] = await db
    .update(todos)
    .set({ completed: not(todos.completed) })
    .where(eq(todos.id, id))
    .returning();
  return toggled;
}

export async function deleteTodo(id: number): Promise<void> {
  await db.delete(todos).where(eq(todos.id, id));
}
