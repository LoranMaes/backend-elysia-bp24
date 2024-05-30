import {
  sqliteTable,
  text,
  integer,
  primaryKey,
} from "drizzle-orm/sqlite-core";
import { users } from "./users";
import { relations } from "drizzle-orm";
import { sub_categories } from "./sub_categories";

export const usersHasSubCategories = sqliteTable(
  "users_has_sub_categories",
  {
    userId: text("user_id").notNull(),
    subCategoryId: text("category_id").notNull(),
    totalAmount: integer("total_amount").notNull(),
  },
  (t) => ({ pk: primaryKey({ columns: [t.userId, t.subCategoryId] }) })
);

export const usersHasSubCategoriesRelations = relations(
  usersHasSubCategories,
  ({ one }) => ({
    subCategory: one(sub_categories, {
      fields: [usersHasSubCategories.subCategoryId],
      references: [sub_categories.id],
    }),
    user: one(users, {
      fields: [usersHasSubCategories.userId],
      references: [users.id],
    }),
  })
);
