import { createId } from "@paralleldrive/cuid2";
import { sql } from "drizzle-orm";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

sqliteTable("tasks", {
  id: text("id").notNull().primaryKey().$defaultFn(createId),
});
