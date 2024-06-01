import { Lucia } from "lucia";
import { db } from "../db";
import { DrizzleSQLiteAdapter } from "@lucia-auth/adapter-drizzle";
import { users } from "../db/schemas/users";
import { sessions } from "../db/schemas/sessions";
import { User } from "../models/user.model";

const adapter = new DrizzleSQLiteAdapter(db, sessions, users);

// Most information from here is from the Getting Started page of Lucia
// https://lucia-auth.com/getting-started/
export const lucia = new Lucia(adapter, {
  sessionCookie: {
    expires: false,
    attributes: {
      secure: true,
      sameSite: "none",
    },
  },
  getUserAttributes: (attributes) => {
    return {
      name: attributes.firstName + " " + attributes.lastName,
      email: attributes.email,
    };
  },
});

// Important!!
declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: User;
  }
}
