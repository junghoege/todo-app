import { z } from "zod";

// Plain zod schema for validating todo create/update input. Deliberately has
// no dependency on `next/cache` or any Next.js request context (unlike
// app/actions.ts, which is a "use server" module) so it can be unit-tested
// directly with `safeParse`.
export const todoInputSchema = z.object({
  title: z.string().trim().min(1, "제목을 입력해주세요."),
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
    .regex(/^\d{4}-\d{2}-\d{2}$/, "마감일 형식이 올바르지 않습니다. (YYYY-MM-DD)")
    .nullable()
    .optional()
    .transform((value) => value ?? null),
  priority: z
    .enum(["low", "medium", "high"], {
      error: "우선순위 값이 올바르지 않습니다.",
    })
    .default("medium"),
});

export type TodoInput = z.infer<typeof todoInputSchema>;

/** Picks a single human-readable message out of a failed safeParse result. */
export function firstTodoInputError(error: z.ZodError): string {
  return error.issues[0]?.message ?? "입력값을 확인해주세요.";
}
