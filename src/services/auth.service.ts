import { Role, User, UserCreation, UserLogin } from "../models/user.model";
import { db } from "../db";
import { users } from "../db/schemas/users";
import { lucia } from "../libs/auth";
import { Cookie, generateIdFromEntropySize } from "lucia";
import { Language } from "../models/language.enum";
import { sql } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";

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

  const checkEmailExists = async (email: string): Promise<boolean> => {
    const emailExists = await db
      .select()
      .from(users)
      .where(sql`email = ${email.toLowerCase()}`)
      .get();
    return Boolean(emailExists);
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

  export const register = async (props: UserCreation) => {
    if (await checkEmailExists(props.email)) {
      return new Response("Email already exists", { status: 400 });
    }

    const hashedPassword = await Bun.password.hash(props.password);
    const userId = generateIdFromEntropySize(10);
    let hashedFileName = undefined;
    if (props.profilePicture) {
      hashedFileName = await saveProfilePicture(props.profilePicture, userId);
    }
    const user = await createUser(
      props,
      hashedPassword,
      userId,
      hashedFileName
    );
    await db.insert(users).values({ ...user });

    const sessionCookie = await createSessionAndCookie(user.id);

    return new Response(null, {
      status: 200,
      headers: {
        "Set-Cookie": sessionCookie.serialize(),
      },
    });
  };
  export const login = async (props: UserLogin) => {
    return props;
  };
  export const logout = async () => {
    return "Logged out successfully!";
  };
}
