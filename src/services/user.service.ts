import { eq, sql } from "drizzle-orm";
import { db } from "../db";
import { categories } from "../db/schemas/categories";
import {
  Category,
  CategoryCreate,
  SubCategory,
  SubCategoryCreate,
} from "../models/category.model";
import { Task, TaskCreate } from "../models/task.model";
import { tasks } from "../db/schemas/tasks";
import { createId } from "@paralleldrive/cuid2";
import { Status } from "../models/status.enum";
import { AuthService } from "./auth.service";
import { User as UserLucia } from "lucia";
import { sub_categories } from "../db/schemas/sub_categories";

const AUTH_SERVICE = AuthService;

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

  const categoryExists = (category_id: string): boolean => {
    return (
      db
        .select()
        .from(categories)
        .where(sql`id = ${category_id}`)
        .get() !== undefined
    );
  };

  const subCategoryExists = (sub_category_id: string): boolean => {
    return (
      db
        .select()
        .from(categories)
        .where(sql`id = ${sub_category_id}`)
        .get() !== undefined
    );
  };

  const categoryNameExists = (category_title: string): boolean => {
    return (
      db
        .select()
        .from(categories)
        .where(sql`title = ${category_title.toLowerCase()}`)
        .get() !== undefined
    );
  };

  const subCategoryNameExists = (sub_category_title: string): boolean => {
    return (
      db
        .select()
        .from(sub_categories)
        .where(sql`title = ${sub_category_title.toLowerCase()}`)
        .get() !== undefined
    );
  };

  const makeTask = async (
    props: TaskCreate,
    user_id: string
  ): Promise<Task> => {
    return {
      id: createId(),
      ...props,
      start: new Date(props.start),
      end: new Date(props.end),
      status: Status.DONE,
      createdAt: new Date(),
      userId: user_id,
    };
  };

  export const getCategories = () => {
    const all_categories = db.select().from(categories).all();
    const all_sub_categories = db.select().from(sub_categories).all();
    const categoriesDict: any = {};

    all_categories.forEach((category) => {
      categoriesDict[category.id] = {
        id: category.id,
        title: category.title,
        sub_categories: [],
      };
    });

    all_sub_categories.forEach((subCategory) => {
      const categoryId = subCategory.categoryId;
      if (categoriesDict[categoryId]) {
        categoriesDict[categoryId].sub_categories.push({
          id: subCategory.id,
          title: subCategory.title,
        });
      }
    });

    const result = Object.values(categoriesDict);
    return result;
  };
  export const getSubCategories = (): SubCategory[] => {
    return db.select().from(sub_categories).all();
  };

  export const createCategory = async (props: CategoryCreate) => {
    if (categoryNameExists(props.title)) {
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

  export const createSubCategory = async (props: SubCategoryCreate) => {
    if (!categoryExists(props.categoryId)) {
      return new Response("Category doesn't exist", {
        status: 400,
      });
    }

    if (subCategoryNameExists(props.title)) {
      return new Response("Sub category already exist", {
        status: 400,
      });
    }

    // Create sub-category.
    const newSubCat: SubCategory = db
      .insert(sub_categories)
      .values({ ...props, title: props.title.toLowerCase() })
      .returning()
      .get();

    return {
      message: "Sub-category created successfully",
      data: newSubCat,
    };
  };

  export const getTasks = async (
    auth_session: string
  ): Promise<Task[] | Response> => {
    const user: UserLucia | null = await AUTH_SERVICE.getCurrentUser(
      auth_session
    );
    if (!user) {
      return new Response("You are not logged in", { status: 400 });
    }
    return db
      .select()
      .from(tasks)
      .where(sql`user_id = ${user.id}`)
      .all();
  };

  export const getTask = async (
    auth_session: string,
    id: string
  ): Promise<Task | Response> => {
    const user: UserLucia | null = await AUTH_SERVICE.getCurrentUser(
      auth_session
    );
    if (!user) {
      return new Response("You are not logged in", { status: 400 });
    }
    const task = db
      .select()
      .from(tasks)
      .where(sql`user_id = ${user.id} AND id = ${id}`)
      .get();
    if (!task) {
      return new Response("Task not found", { status: 404 });
    }
    return task;
  };

  export const createTask = async (props: TaskCreate, auth_session: string) => {
    if (!categoryExists(props.categoryId)) {
      return new Response("Category doesn't exist", {
        status: 400,
      });
    }
    if (props.subCategoryId && !subCategoryExists(props.subCategoryId)) {
      return new Response("Sub-category doesn't exist", {
        status: 400,
      });
    }

    // Check if start is before end.
    if (new Date(props.start) >= new Date(props.end)) {
      return new Response("Start date is after end date", {
        status: 400,
      });
    }

    // Create task.
    const user: UserLucia | null = await AUTH_SERVICE.getCurrentUser(
      auth_session
    );
    if (!user) {
      return new Response("You are not logged in", { status: 400 });
    }

    const task: Task = await makeTask(props, user.id);

    await db.insert(tasks).values({ ...task });

    return {
      message: "Task created successfully",
      data: task,
    };
  };

  export const deleteTask = async (id: string, auth_session: string) => {
    const user: UserLucia | null = await AUTH_SERVICE.getCurrentUser(
      auth_session
    );
    if (!user) {
      return new Response("You are not logged in", { status: 400 });
    }

    const task: Task = db
      .select()
      .from(tasks)
      .where(sql`user_id = ${user.id} AND id = ${id}`)
      .get() as Task;

    if (!task) {
      return new Response("Task not found", { status: 404 });
    }

    db.delete(tasks)
      .where(sql`id = ${id}`)
      .run();

    return {
      message: "Task deleted successfully",
    };
  };
}
