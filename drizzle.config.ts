import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/schemas/*",
  out: "./drizzle",
  dialect: "sqlite", // 'postgresql' | 'mysql' | 'sqlite'
  dbCredentials: {
    url: './sqlite.db',
    dbName: 'time-registration.db',
  },
});
