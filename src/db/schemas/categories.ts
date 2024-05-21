import { createId } from "@paralleldrive/cuid2";
import { relations, sql } from "drizzle-orm";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { users } from "./users";
import { tasks } from "./tasks";

// MANY TO MANY TO GET THE MOST USED CATS PER USER

export const categories = sqliteTable("categories", {
  id: text("id").notNull().primaryKey().$defaultFn(createId),
  title: text("title").notNull().unique(),
});

export const categoriesRelations = relations(categories, ({ many }) => ({
  usersHasCategories: many(users),
  subCategories: many(categories),
  task: many(tasks),
}));

export type Category = typeof categories.$inferSelect;
export type CategoryCreate = typeof categories.$inferInsert;
