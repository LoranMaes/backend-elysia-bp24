import { sql } from "drizzle-orm";
import { db } from "../db";
import { users } from "../db/schemas/users";
import { User, UserCreation, UserWithoutPassword } from "../models/user.model";
import { AuthService } from "./auth.service";

const AUTH_SERVICE = AuthService;

export namespace AdminService {
  export const getUsers = async (): Promise<
    UserWithoutPassword[] | Response
  > => {
    const users_database: User[] = db.select().from(users).all();
    if (!users_database.length)
      return new Response("No users found", { status: 404 });
    // Trim the password from the response
    const all_users: UserWithoutPassword[] = users_database.map((user) => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
    return all_users;
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

    db.delete(users).where(sql`id = ${id}`);

    return { message: "User deleted successfully" };
  };
}
