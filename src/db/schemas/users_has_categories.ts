import {
  sqliteTable,
  text,
  integer,
  primaryKey,
} from "drizzle-orm/sqlite-core";
import { users } from "./users";
import { categories } from "./categories";
import { relations } from "drizzle-orm";

export const usersHasCategories = sqliteTable(
  "users_has_categories",
  {
    userId: text("user_id")
      .notNull()
      .references(() => users.id),
    categoryId: text("category_id")
      .notNull()
      .references(() => categories.id),
    total_amount: integer("total_amount").notNull(),
  },
  (t) => ({ pk: primaryKey({ columns: [t.userId, t.categoryId] }) })
);

export const usersHasCategoriesRelations = relations(
  usersHasCategories,
  ({ one }) => ({
    category: one(categories, {
      fields: [usersHasCategories.categoryId],
      references: [categories.id],
    }),
    user: one(users, {
      fields: [usersHasCategories.userId],
      references: [users.id],
    }),
  })
);