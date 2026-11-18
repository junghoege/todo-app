import { describe, expect, it } from "vitest";
import { todoInputSchema } from "./todo-input";

describe("todoInputSchema", () => {
  describe("title", () => {
    it("rejects an empty title", () => {
      const result = todoInputSchema.safeParse({ title: "" });
      expect(result.success).toBe(false);
    });

    it("rejects a whitespace-only title", () => {
      const result = todoInputSchema.safeParse({ title: "   " });
      expect(result.success).toBe(false);
    });

    it("accepts a valid title and trims it", () => {
      const result = todoInputSchema.safeParse({ title: "  우유 사기  " });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.title).toBe("우유 사기");
      }
    });
  });

  describe("priority", () => {
    it("rejects an invalid priority value", () => {
      const result = todoInputSchema.safeParse({
        title: "할 일",
        priority: "urgent",
      });
      expect(result.success).toBe(false);
    });

    it.each(["low", "medium", "high"] as const)(
      "accepts the valid priority value %s",
      (priority) => {
        const result = todoInputSchema.safeParse({ title: "할 일", priority });
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.priority).toBe(priority);
        }
      },
    );

    it("defaults to medium when omitted", () => {
      const result = todoInputSchema.safeParse({ title: "할 일" });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.priority).toBe("medium");
      }
    });
  });

  describe("description", () => {
    it("treats a whitespace-only description as omitted (coerces to null)", () => {
      const result = todoInputSchema.safeParse({
        title: "할 일",
        description: "   ",
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.description).toBeNull();
      }
    });

    it("trims a valid description", () => {
      const result = todoInputSchema.safeParse({
        title: "할 일",
        description: "  우유, 계란  ",
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.description).toBe("우유, 계란");
      }
    });

    it("treats a null description as valid (optional field)", () => {
      const result = todoInputSchema.safeParse({
        title: "할 일",
        description: null,
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.description).toBeNull();
      }
    });
  });

  describe("dueDate", () => {
    it("rejects an invalid dueDate format", () => {
      const result = todoInputSchema.safeParse({
        title: "할 일",
        dueDate: "2026/12/01",
      });
      expect(result.success).toBe(false);
    });

    it("rejects a nonsense dueDate string", () => {
      const result = todoInputSchema.safeParse({
        title: "할 일",
        dueDate: "not-a-date",
      });
      expect(result.success).toBe(false);
    });

    it("accepts a valid YYYY-MM-DD dueDate", () => {
      const result = todoInputSchema.safeParse({
        title: "할 일",
        dueDate: "2026-12-01",
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.dueDate).toBe("2026-12-01");
      }
    });

    it("treats a null dueDate as valid (optional field)", () => {
      const result = todoInputSchema.safeParse({ title: "할 일", dueDate: null });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.dueDate).toBeNull();
      }
    });
  });
});
