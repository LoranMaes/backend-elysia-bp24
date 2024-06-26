// SOURCE: https://lucia-auth.com/guides/validate-session-cookies/elysia

import Elysia from "elysia";
import { verifyRequestOrigin } from "lucia";
import type { User, Session } from "lucia";
import { lucia } from "../libs/auth";
import { Role } from "../models/user.model";
import { db } from "../db";
import { users } from "../db/schemas/users";
import { sql } from "drizzle-orm";

export const csrfProtection = new Elysia().derive(
  { as: "global" },
  async (
    context
  ): Promise<{
    user: User | null;
    session: Session | null;
  }> => {
    // CSRF check
    if (context.request.method !== "GET") {
      const originHeader = context.request.headers.get("Origin");
      const hostHeader = context.request.headers.get("Host");
      if (
        !originHeader ||
        !hostHeader ||
        !verifyRequestOrigin(originHeader, [hostHeader])
      ) {
        return {
          user: null,
          session: null,
        };
      }
    }

    const cookieHeader = context.request.headers.get("Cookie") ?? "";
    const sessionId = lucia.readSessionCookie(cookieHeader);
    if (!sessionId) {
      return {
        user: null,
        session: null,
      };
    }

    const { session, user } = await lucia.validateSession(sessionId);
    if (session && session.fresh) {
      const sessionCookie = lucia.createSessionCookie(session.id);
      context.cookie[sessionCookie.name].set({
        value: sessionCookie.value,
        ...sessionCookie.attributes,
      });
    }
    if (!session) {
      const sessionCookie = lucia.createBlankSessionCookie();
      context.cookie?.[sessionCookie.name].set({
        value: sessionCookie.value,
        ...sessionCookie.attributes,
      });
    }
    return {
      user,
      session,
    };
  }
);

export const isLoggedInGuard = async (
  sessionId: string | undefined | null
): Promise<boolean> => {
  if (!sessionId) return false;
  const { session, user } = await lucia.validateSession(sessionId);
  return Boolean(session && user);
};

export const isAdminGuard = async (
  sessionId: string | undefined | null
): Promise<boolean> => {
  if (!sessionId) return false;
  const { session, user } = await lucia.validateSession(sessionId);
  const role: Role = db
    .select()
    .from(users)
    .where(sql`id = ${user?.id}`)
    .get()?.role as Role;
  return Boolean(session && user && role === Role.ADMIN);
};
