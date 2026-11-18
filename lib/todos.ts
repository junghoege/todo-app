import { asc, eq, not } from "drizzle-orm";
import { db } from "./db/client";
import { todos, type Todo } from "./db/schema";

export async function listTodos(): Promise<Todo[]> {
  return db.select().from(todos).orderBy(asc(todos.completed), asc(todos.createdAt));
}

export async function createTodo(input: { title: string }): Promise<Todo> {
  const [created] = await db.insert(todos).values({ title: input.title }).returning();
  return created;
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
