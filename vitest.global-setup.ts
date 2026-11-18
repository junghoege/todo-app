import { existsSync, mkdirSync, unlinkSync } from "node:fs";
import path from "node:path";
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { migrate } from "drizzle-orm/libsql/migrator";

const TEST_DB_DIR = ".vitest-data";
const TEST_DB_FILE = `${TEST_DB_DIR}/test.db`;

function removeTestDbFiles() {
  for (const suffix of ["", "-wal", "-shm"]) {
    const file = path.resolve(`${TEST_DB_FILE}${suffix}`);
    try {
      if (existsSync(file)) unlinkSync(file);
    } catch {
      // Windows can still hold a lock briefly after a client closes; the next
      // run's setup() will clean it up, so a stale file here is harmless.
    }
  }
}

export default async function setup() {
  mkdirSync(path.resolve(TEST_DB_DIR), { recursive: true });
  removeTestDbFiles();

  process.env.TURSO_DATABASE_URL = `file:${TEST_DB_FILE}`;
  process.env.TURSO_AUTH_TOKEN = "";

  const client = createClient({ url: process.env.TURSO_DATABASE_URL });
  const db = drizzle(client);
  await migrate(db, { migrationsFolder: path.resolve("drizzle") });
  client.close();

  return () => {
    removeTestDbFiles();
  };
}
