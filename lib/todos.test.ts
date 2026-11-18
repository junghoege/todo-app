import { beforeEach, describe, expect, it } from "vitest";
import { db } from "./db/client";
import { todos } from "./db/schema";
import { createTodo, deleteTodo, listTodos, toggleTodo, updateTodo } from "./todos";

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

  it("persists optional description, dueDate, and priority", async () => {
    const created = await createTodo({
      title: "우유 사기",
      description: "저지방 우유로",
      dueDate: "2026-12-01",
      priority: "high",
    });

    expect(created).toMatchObject({
      description: "저지방 우유로",
      dueDate: "2026-12-01",
      priority: "high",
    });

    const result = await listTodos();
    expect(result[0]).toMatchObject({
      description: "저지방 우유로",
      dueDate: "2026-12-01",
      priority: "high",
    });
  });

  it("defaults priority to medium and leaves description/dueDate null when omitted", async () => {
    const created = await createTodo({ title: "청소하기" });

    expect(created).toMatchObject({
      description: null,
      dueDate: null,
      priority: "medium",
    });
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

describe("updateTodo", () => {
  it("updates title, description, dueDate, and priority", async () => {
    const created = await createTodo({ title: "우유 사기" });

    const updated = await updateTodo(created.id, {
      title: "두유 사기",
      description: "무가당으로",
      dueDate: "2026-12-05",
      priority: "high",
    });

    expect(updated).toMatchObject({
      id: created.id,
      title: "두유 사기",
      description: "무가당으로",
      dueDate: "2026-12-05",
      priority: "high",
    });
  });

  it("persists the update so it appears in listTodos", async () => {
    const created = await createTodo({ title: "청소하기" });

    await updateTodo(created.id, { title: "방 청소하기" });

    const result = await listTodos();
    expect(result[0]).toMatchObject({ title: "방 청소하기" });
  });

  it("leaves completed status untouched", async () => {
    const created = await createTodo({ title: "청소하기" });
    await toggleTodo(created.id);

    const updated = await updateTodo(created.id, { title: "방 청소하기" });

    expect(updated.completed).toBe(true);
  });

  it("clears description and dueDate when omitted", async () => {
    const created = await createTodo({
      title: "우유 사기",
      description: "저지방 우유로",
      dueDate: "2026-12-01",
      priority: "high",
    });

    const updated = await updateTodo(created.id, { title: "우유 사기" });

    expect(updated).toMatchObject({
      description: null,
      dueDate: null,
    });
  });
});

describe("listTodos sort order", () => {
  it("orders incomplete todos by priority descending (high > medium > low)", async () => {
    await createTodo({ title: "낮음", priority: "low" });
    await createTodo({ title: "높음", priority: "high" });
    await createTodo({ title: "보통", priority: "medium" });

    const result = await listTodos();

    expect(result.map((t) => t.title)).toEqual(["높음", "보통", "낮음"]);
  });

  it("orders same-priority todos by dueDate ascending", async () => {
    await createTodo({ title: "늦은 마감", priority: "high", dueDate: "2026-12-31" });
    await createTodo({ title: "빠른 마감", priority: "high", dueDate: "2026-12-01" });
    await createTodo({ title: "중간 마감", priority: "high", dueDate: "2026-12-15" });

    const result = await listTodos();

    expect(result.map((t) => t.title)).toEqual(["빠른 마감", "중간 마감", "늦은 마감"]);
  });

  it("sorts todos with no dueDate after ones with a dueDate within the same priority tier", async () => {
    await createTodo({ title: "마감일 없음", priority: "high" });
    await createTodo({ title: "마감일 있음", priority: "high", dueDate: "2026-12-01" });

    const result = await listTodos();

    expect(result.map((t) => t.title)).toEqual(["마감일 있음", "마감일 없음"]);
  });

  it("falls back to createdAt ascending when priority and dueDate are tied", async () => {
    await createTodo({ title: "먼저 생성", priority: "medium", dueDate: "2026-12-01" });
    await createTodo({ title: "나중 생성", priority: "medium", dueDate: "2026-12-01" });

    const result = await listTodos();

    expect(result.map((t) => t.title)).toEqual(["먼저 생성", "나중 생성"]);
  });

  it("applies priority/dueDate/createdAt ordering independently within each completed state", async () => {
    const lowNoDue = await createTodo({ title: "완료-낮음", priority: "low" });
    const highLate = await createTodo({ title: "완료-높음-늦은마감", priority: "high", dueDate: "2026-12-31" });
    await toggleTodo(lowNoDue.id);
    await toggleTodo(highLate.id);
    await createTodo({ title: "미완료-보통", priority: "medium" });
    await createTodo({ title: "미완료-높음-빠른마감", priority: "high", dueDate: "2026-12-01" });

    const result = await listTodos();

    expect(result.map((t) => t.title)).toEqual([
      "미완료-높음-빠른마감",
      "미완료-보통",
      "완료-높음-늦은마감",
      "완료-낮음",
    ]);
  });
});

describe("deleteTodo", () => {
  it("removes the todo so it no longer appears in listTodos", async () => {
    const created = await createTodo({ title: "지울 항목" });

    await deleteTodo(created.id);

    expect(await listTodos()).toEqual([]);
  });
});
