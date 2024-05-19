// Command to run the migration:
// bunx drizzle-kit generate:sqlite --schema ./*

import { createId } from "@paralleldrive/cuid2";
import { sql } from "drizzle-orm";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { Language } from "../../models/language.enum";
import { Role } from "../../models/user.model";

const languageValues = Object.values(Language) as [string, ...string[]];
const roleValues = Object.values(Role) as [string, ...string[]];

export const users = sqliteTable("users", {
  id: text("id").notNull().primaryKey().$defaultFn(createId),
  email: text("email").notNull().unique(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  profilePicture: text("profile_picture"),
  role: text("role", { enum: roleValues }).notNull(),
  password: text("password").notNull(),
  language: text("language", { enum: languageValues }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .default(sql`(current_timestamp)`)
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }),
});
