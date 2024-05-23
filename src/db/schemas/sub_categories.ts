import { createId } from "@paralleldrive/cuid2";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";
import { categories } from "./categories";
import { tasks } from "./tasks";
import { usersHasSubCategories } from "./users_has_sub_categories";

export const sub_categories = sqliteTable("sub_categories", {
  id: text("id").notNull().primaryKey().$defaultFn(createId),
  title: text("title").notNull().unique(),
  categoryId: text("category_id").notNull(),
});

export const subCategoriesRelations = relations(
  sub_categories,
  ({ one, many }) => ({
    usersHasSubCategories: many(usersHasSubCategories),
    tasks: many(tasks),
    category: one(categories, {
      fields: [sub_categories.categoryId],
      references: [categories.id],
    }),
  })
);

export type SubCategory = typeof sub_categories.$inferSelect;
export type SubCategoryCreate = typeof sub_categories.$inferInsert;
