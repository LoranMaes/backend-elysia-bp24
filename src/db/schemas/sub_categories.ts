import { createId } from "@paralleldrive/cuid2";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { users } from "./users";
import { relations } from "drizzle-orm";
import { categories } from "./categories";
import { tasks } from "./tasks";

export const sub_categories = sqliteTable("sub_categories", {
  id: text("id").notNull().primaryKey().$defaultFn(createId),
  title: text("title").notNull().unique(),
  categoryId: text("category_id")
    .notNull()
    .references(() => categories.id),
});

export const subCategoriesRelations = relations(
  sub_categories,
  ({ one, many }) => ({
    usersHasSubCategories: many(users),
    tasks: many(tasks),
    category: one(categories, {
      fields: [sub_categories.categoryId],
      references: [categories.id],
    }),
  })
);

export type SubCategory = typeof sub_categories.$inferSelect;
export type SubCategoryCreate = typeof sub_categories.$inferInsert;
