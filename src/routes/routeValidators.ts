import { error, t } from "elysia";
import { regexEmail } from "../libs/regex";

export const generalSchema = {
  "route.id": t.Object({
    id: t.Number(),
  }),
  "route.register": t.Object({
    firstName: t.String({ error: "First name is required" }),
    lastName: t.String({ error: "Last name is required" }),
    email: t.RegExp(regexEmail, { error: "Invalid email" }),
    profilePicture: t.Optional(
      t.File({
        type: "image",
        maxSize: "2m",
        error: "File should be an image and max 2M.",
      })
    ),
    password: t.String({
      minLength: 8,
      maxLength: 30,
      error: "Password must be between 8 and 30 characters",
    }),
  }),
  "route.login": t.Object({
    email: t.String({ error: "Email is required" }),
    password: t.String({ error: "Password is required" }),
  }),
  "route.createCategory": t.Object({
    title: t.String({ error: "Title is required" }),
  }),
};
