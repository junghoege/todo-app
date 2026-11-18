"use client";

import type { Priority } from "@/lib/db/schema";

const PRIORITY_OPTIONS: { value: Priority; label: string }[] = [
  { value: "low", label: "낮음" },
  { value: "medium", label: "보통" },
  { value: "high", label: "높음" },
];

/**
 * The title/description/dueDate/priority field block shared by
 * `AddTodoForm` and `EditTodoForm`. Each caller wires its own
 * `useActionState`/`<form action>` around this; only the field markup lives
 * here.
 */
export function TodoFields({
  titlePlaceholder,
  defaultTitle = "",
  defaultDescription = "",
  defaultDueDate = "",
  defaultPriority = "medium",
  submitLabel,
}: {
  titlePlaceholder?: string;
  defaultTitle?: string;
  defaultDescription?: string;
  defaultDueDate?: string;
  defaultPriority?: Priority;
  submitLabel: string;
}) {
  return (
    <>
      <input
        type="text"
        name="title"
        placeholder={titlePlaceholder}
        defaultValue={defaultTitle}
        className="rounded border border-black/[.08] px-3 py-2 dark:border-white/[.145]"
      />
      <input
        type="text"
        name="description"
        placeholder="설명 (선택)"
        defaultValue={defaultDescription}
        className="rounded border border-black/[.08] px-3 py-2 dark:border-white/[.145]"
      />
      <div className="flex gap-2">
        <input
          type="date"
          name="dueDate"
          aria-label="마감일"
          defaultValue={defaultDueDate}
          className="flex-1 rounded border border-black/[.08] px-3 py-2 dark:border-white/[.145]"
        />
        <select
          name="priority"
          defaultValue={defaultPriority}
          aria-label="우선순위"
          className="rounded border border-black/[.08] px-3 py-2 dark:border-white/[.145]"
        >
          {PRIORITY_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="rounded bg-foreground px-4 py-2 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
        >
          {submitLabel}
        </button>
      </div>
    </>
  );
}

/** Renders a Server Action's `state.error`, if present, as an alert. */
export function TodoFormError({ error }: { error?: string | null }) {
  if (!error) return null;

  return (
    <p className="text-sm text-red-600 dark:text-red-400" role="alert">
      {error}
    </p>
  );
}
