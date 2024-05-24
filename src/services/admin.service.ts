import { sql } from "drizzle-orm";
import { db } from "../db";
import { users } from "../db/schemas/users";
import { User, UserCreation } from "../models/user.model";
import { AuthService } from "./auth.service";
import { ApiResponse } from "../types/api.types";

const AUTH_SERVICE = AuthService;

export namespace AdminService {
  export const getUsers = async (): Promise<User[] | Response> => {
    const all_users: User[] = db.select().from(users).all();
    if (!all_users.length)
      return new Response("No users found", { status: 404 });
    return all_users;
  };

  export const getUserById = (id: string): User | Response => {
    const user = db
      .select()
      .from(users)
      .where(sql`id = ${id}`)
      .get();
    if (!user) return new Response("User not found", { status: 404 });
    return user;
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

    db.delete(users).where(sql`id = ${id}`);
    
    return { message: "User deleted successfully" };
  };
}
