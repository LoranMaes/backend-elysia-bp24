import {
  Role,
  User,
  UserCreation,
  UserLogin,
  UserWithoutPassword,
} from "../models/user.model";
import { db } from "../db";
import { users } from "../db/schemas/users";
import { lucia } from "../libs/auth";
import { Cookie, generateIdFromEntropySize, User as UserLucia } from "lucia";
import { Language } from "../models/language.enum";
import { sql } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";
import { sessions } from "../db/schemas/sessions";

export namespace AuthService {
  const createUser = async (
    props: UserCreation,
    hashedPassword: string,
    userId: string,
    hashedFileName?: string
  ): Promise<User> => {
    return {
      id: userId,
      ...props,
      email: props.email.toLowerCase(),
      profilePicture: hashedFileName || null,
      password: hashedPassword,
      role: Role.USER,
      language: Language.ENGLISH,
      createdAt: new Date(),
      updatedAt: null,
    };
  };

  const checkEmailExists = (email: string): boolean => {
    const emailExists = db
      .select()
      .from(users)
      .where(sql`email = ${email.toLowerCase()}`)
      .get();
    return emailExists ? true : false;
  };

  const createSessionAndCookie = async (userId: string): Promise<Cookie> => {
    const session = await lucia.createSession(userId, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    return sessionCookie;
  };

  const saveProfilePicture = async (
    file: File,
    userId: string
  ): Promise<string> => {
    const extension = file.name.split(".")[file.name.split(".").length - 1];
    const timestamp = new Date().toISOString().replace(/[-:.]/g, "");
    const unique_identifier = createId();
    await Bun.write(
      `${Bun.env.FILE_UPLOAD_PREFIX || "storage/uploads"}/${userId}/${
        timestamp + unique_identifier
      }.${extension}`,
      file
    );
    return `${timestamp + unique_identifier}.${extension}`;
  };

  export const registerNewUser = async (
    props: UserCreation
  ): Promise<UserWithoutPassword | Response> => {
    if (checkEmailExists(props.email)) {
      return new Response("Email already exists", { status: 400 });
    }

    const hashedPassword = await Bun.password.hash(props.password);
    const userId = generateIdFromEntropySize(10);
    let hashedFileName = undefined;
    if (props.profilePicture) {
      hashedFileName = await saveProfilePicture(props.profilePicture, userId);
    }
    const user: User = await createUser(
      props,
      hashedPassword,
      userId,
      hashedFileName
    );

    const { password, ...newUser } = await db
      .insert(users)
      .values({ ...user })
      .returning()
      .get();
    return newUser;
  };

  export const register = async (props: UserCreation) => {
    const newUser = await registerNewUser(props);
    if (newUser instanceof Response) return newUser;

    const sessionCookie = await createSessionAndCookie(newUser.id);

    return new Response("New user created!", {
      status: 200,
      headers: {
        "Set-Cookie": sessionCookie.serialize(),
      },
    });
  };
  export const login = async (props: UserLogin) => {
    const user = db
      .select()
      .from(users)
      .where(sql`email = ${props.email}`)
      .get();

    // Tip: For security reasons I'm verifying the password before validating the user
    // This way you can avoid timing attacks (https://en.wikipedia.org/wiki/Timing_attack)
    let verifiedPassword = false;
    if (user)
      verifiedPassword = await Bun.password.verify(
        props.password,
        user.password
      );

    if (!user) {
      return new Response("Invalid email or password", { status: 404 });
    }
    if (!verifiedPassword) {
      return new Response("Invalid password or password", { status: 400 });
    }

    const sessionCookie = await createSessionAndCookie(user.id);

    return new Response("User logged in successfully", {
      status: 200,
      headers: {
        "Set-Cookie": sessionCookie.serialize(),
      },
    });
  };
  export const logout = async (auth_session: string) => {
    if (!auth_session) {
      return new Response("You are not logged in", { status: 400 });
    }

    const session = db
      .select()
      .from(sessions)
      .where(sql`id = ${auth_session}`)
      .get();

    if (!session) {
      return new Response("You are not logged in", { status: 400 });
    }

    // Remove the session
    await lucia.invalidateSession(session.id);
    const sessionCookie = lucia.createBlankSessionCookie();

    return new Response("Logged out successfully", {
      status: 200,
      headers: {
        "Set-Cookie": sessionCookie.serialize(),
      },
    });
  };

  export const getCurrentUser = async (
    auth_session: string
  ): Promise<UserLucia | null> => {
    if (!auth_session) return null;
    const { user, session } = await lucia.validateSession(auth_session);
    return user;
  };

  export const getAllUserSessions = async (user_id: string) => {
    return await lucia.getUserSessions(user_id);
  };

  export const logoutAllSessions = async (user_id: string) => {
    return await lucia.invalidateUserSessions(user_id);
  };
}
