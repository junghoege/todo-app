import { beforeEach, describe, expect, it } from "vitest";
import { db } from "./db/client";
import { todos } from "./db/schema";
import { createTodo, deleteTodo, listTodos, toggleTodo } from "./todos";

beforeEach(async () => {
  await db.delete(todos);
});

describe("listTodos", () => {
  it("returns an empty list when no todos exist", async () => {
    expect(await listTodos()).toEqual([]);
  });
});

describe("createTodo", () => {
  it("creates a todo that then appears in listTodos", async () => {
    await createTodo({ title: "우유 사기" });

    const result = await listTodos();

    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({ title: "우유 사기", completed: false });
  });

  it("lists todos oldest-first when none are completed", async () => {
    await createTodo({ title: "첫 번째" });
    await createTodo({ title: "두 번째" });

    const result = await listTodos();

    expect(result.map((t) => t.title)).toEqual(["첫 번째", "두 번째"]);
  });
});

describe("toggleTodo", () => {
  it("marks an incomplete todo as completed", async () => {
    const created = await createTodo({ title: "청소하기" });

    const toggled = await toggleTodo(created.id);

    expect(toggled.completed).toBe(true);
  });

  it("marks a completed todo as incomplete again", async () => {
    const created = await createTodo({ title: "청소하기" });
    await toggleTodo(created.id);

    const toggled = await toggleTodo(created.id);

    expect(toggled.completed).toBe(false);
  });

  it("moves completed todos below incomplete ones in listTodos", async () => {
    const first = await createTodo({ title: "첫 번째" });
    await createTodo({ title: "두 번째" });
    await toggleTodo(first.id);

    const result = await listTodos();

    expect(result.map((t) => t.title)).toEqual(["두 번째", "첫 번째"]);
  });
});

describe("deleteTodo", () => {
  it("removes the todo so it no longer appears in listTodos", async () => {
    const created = await createTodo({ title: "지울 항목" });

    await deleteTodo(created.id);

    expect(await listTodos()).toEqual([]);
  });
});
