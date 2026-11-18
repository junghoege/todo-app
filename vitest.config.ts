import { defaultExclude, defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    globalSetup: "./vitest.global-setup.ts",
    fileParallelism: false,
    exclude: [...defaultExclude, "**/.claude/worktrees/**"],
  },
});
