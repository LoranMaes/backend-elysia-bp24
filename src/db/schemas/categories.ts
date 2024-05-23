import { createId } from "@paralleldrive/cuid2";
import { relations } from "drizzle-orm";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { tasks } from "./tasks";
import { usersHasCategories } from "./users_has_categories";
import { sub_categories } from "./sub_categories";

export const categories = sqliteTable("categories", {
  id: text("id").notNull().primaryKey().$defaultFn(createId),
  title: text("title").notNull().unique(),
});

// MANY TO MANY TO GET THE MOST USED CATEGORIES FOR A USER
export const categoriesRelations: any = relations(categories, ({ many }) => ({
  usersHasCategories: many(usersHasCategories),
  subCategories: many(sub_categories),
  task: many(tasks),
}));

export type Category = typeof categories.$inferSelect;
export type CategoryCreate = typeof categories.$inferInsert;
