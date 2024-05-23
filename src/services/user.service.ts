import { sql } from "drizzle-orm";
import { db } from "../db";
import { categories } from "../db/schemas/categories";
import { Category, CategoryCreate } from "../models/category.model";

export namespace UserService {
  const insertCategory = async (
    category: CategoryCreate
  ): Promise<Category | undefined> => {
    const newCategory: Category = db
      .insert(categories)
      .values({ title: category.title.toLowerCase() })
      .returning()
      .get();
    return newCategory;
  };

  export const getCategories = async (): Promise<Category[]> => {
    return db.select().from(categories).all();
  };

  export const createCategory = async (props: CategoryCreate) => {
    // Check if category doesn't exist yet.
    const categoryExists = db
      .select()
      .from(categories)
      .where(sql`title = ${props.title.toLowerCase()}`)
      .get();
    if (categoryExists) {
      return new Response("Category already exists", {
        status: 400,
      });
    }

    // Create category.
    const newCat = await insertCategory(props);

    return {
      message: "Category created successfully",
      data: newCat,
    };
  };
}
