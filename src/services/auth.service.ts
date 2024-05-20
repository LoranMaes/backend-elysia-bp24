import { hash, password } from "bun";
import { Role, User, UserCreation, UserLogin } from "../models/user.model";
import { db } from "../db";
import { users } from "../db/schemas/users";
import { lucia } from "../libs/auth";
import { generateIdFromEntropySize } from "lucia";
import { Language } from "../models/language.enum";

export namespace AuthService {
  export const register = async (props: UserCreation) => {
    const hashedPassword = await Bun.password.hash(props.password);
    const userId = generateIdFromEntropySize(10);
    try {
      const user: User = {
        id: userId,
        ...props,
        profilePicture: null,
        password: hashedPassword,
        role: Role.USER,
        language: Language.ENGLISH,
        createdAt: new Date(),
        updatedAt: null,
      };
      const all = await db.select().from(users);
      console.log(all);
      await db.insert(users).values({ ...user });
      console.log(user);
      const session = await lucia.createSession(userId, {});
      const sessionCookie = lucia.createSessionCookie(session.id);
      return new Response(null, {
        status: 200,
        headers: {
          "Set-Cookie": sessionCookie.serialize(),
        },
      });
    } catch (error) {
      throw "User already exists";
    }
  };
  export const login = async (props: UserLogin) => {
    return props;
  };
  export const logout = async () => {
    return "Logged out successfully!";
  };
}
