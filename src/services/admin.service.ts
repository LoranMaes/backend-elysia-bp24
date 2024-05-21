import { db } from "../db";
import { users } from "../db/schemas/users";
import { User } from "../models/user.model";

export namespace AdminService {
  export const getUsers = async (): Promise<User[] | undefined> => {
    const all_users: User[] = db.select().from(users).all();
    console.log(all_users);
    return all_users;
  };
}
