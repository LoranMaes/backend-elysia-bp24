import { createId } from "@paralleldrive/cuid2";
import { relations, sql } from "drizzle-orm";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { Status } from "../../models/status.enum";
import { users } from "./users";
import { categories } from "./categories";
import { sub_categories } from "./sub_categories";

const statusValues = Object.values(Status) as [string, ...string[]];

export const tasks = sqliteTable("tasks", {
  id: text("id").notNull().primaryKey().$defaultFn(createId),
  start: integer("start", { mode: "timestamp" }).notNull(),
  end: integer("end", { mode: "timestamp" }).notNull(),
  title: text("title").notNull(),
  description: text("description"),
  status: text("status", { enum: statusValues }).notNull(),
  color: text("color").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  categoryId: text("category_id").references(() => categories.id),
  subCategoryId: text("sub_category_id").references(() => sub_categories.id),
});

export const taskRelations = relations(tasks, ({ one }) => ({
  user: one(users, {
    fields: [tasks.userId],
    references: [users.id],
  }),
  category: one(categories, {
    fields: [tasks.categoryId],
    references: [categories.id],
  }),
  subCategory: one(sub_categories, {
    fields: [tasks.subCategoryId],
    references: [sub_categories.id],
  }),
}));

export type Task = typeof tasks.$inferSelect;
export type TaskCreate = typeof tasks.$inferInsert;
