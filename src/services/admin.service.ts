import { eq, sql } from "drizzle-orm";
import { db } from "../db";
import { users } from "../db/schemas/users";
import { User, UserCreation, UserWithoutPassword } from "../models/user.model";
import { AuthService } from "./auth.service";
import { tasks } from "../db/schemas/tasks";
import { categories } from "../db/schemas/categories";
import { sub_categories } from "../db/schemas/sub_categories";

const AUTH_SERVICE = AuthService;

export namespace AdminService {
  export const getUsers = async () => {
    const users_database: User[] = db.select().from(users).all();
    if (!users_database.length)
      return new Response("No users found", { status: 404 });
    // Trim the password from the response
    const all_users: UserWithoutPassword[] = users_database.map((user) => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
    return { message: "Users fetched successfully", data: all_users };
  };

  export const getTasks = async () => {
    const all_tasks = db
      .select()
      .from(tasks)
      .all()
      .sort((a, b) => b.end.getTime() - a.end.getTime());

    const final_tasks = all_tasks.map((task) => {
      const u = db
        .select()
        .from(users)
        .where(sql`id = ${task.userId}`)
        .get();
      return {
        ...task,
        user: `${u?.firstName} ${u?.lastName}`,
        category: db
          .select()
          .from(categories)
          .where(sql`id = ${task.categoryId}`)
          .get()?.title,
        subCategory: task.subCategoryId
          ? db
              .select()
              .from(sub_categories)
              .where(sql`id = ${task.subCategoryId}`)
              .get()?.title
          : null,
      };
    });

    return { message: "Tasks fetched successfully", data: final_tasks };
  };

  export const getUserById = (id: string): UserWithoutPassword | Response => {
    const user = db
      .select()
      .from(users)
      .where(sql`id = ${id}`)
      .get();
    if (!user) return new Response("User not found", { status: 404 });
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  };

  export const createUserByAdmin = async (props: UserCreation) => {
    const newUser = await AUTH_SERVICE.registerNewUser(props);
    if (newUser instanceof Response) return newUser;
    return {
      message: "User created successfully",
      data: newUser,
    };
  };

  export const deleteUserById = async (id: string) => {
    const user = db
      .select()
      .from(users)
      .where(sql`id = ${id}`)
      .get();

    if (!user) return new Response("User not found", { status: 404 });

    await AUTH_SERVICE.logoutAllSessions(id);

    await db.delete(users).where(sql`id = ${id}`);

    return { message: "User deleted successfully" };
  };
}
