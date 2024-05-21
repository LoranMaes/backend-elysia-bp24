import { createId } from "@paralleldrive/cuid2";
import { relations, sql } from "drizzle-orm";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { tasks } from "./tasks";
import { usersHasCategories } from "./users_has_categories";
import { sub_categories } from "./sub_categories";

// MANY TO MANY TO GET THE MOST USED CATS PER USER

export const categories = sqliteTable("categories", {
  id: text("id").notNull().primaryKey().$defaultFn(createId),
  title: text("title").notNull().unique(),
});

export const categoriesRelations = relations(categories, ({ many }) => ({
  usersHasCategories: many(usersHasCategories),
  subCategories: many(sub_categories),
  task: many(tasks),
}));

export type Category = typeof categories.$inferSelect;
export type CategoryCreate = typeof categories.$inferInsert;
