import { error, t } from "elysia";
import { regexEmail, regexHexadecimal, regexISO8601Date } from "../libs/regex";

export const generalSchema = {
  "route.id": t.Object({
    id: t.String(),
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
    email: t.RegExp(regexEmail, { error: "Invalid email" }),
    password: t.String({ error: "Password is required" }),
  }),
  "route.createCategory": t.Object({
    title: t.String({
      error: "Title is required",
      minLength: 8,
      maxLength: 30,
    }),
  }),
  "route.createSubCategory": t.Object({
    title: t.String({
      error: "Title is required",
      minLength: 8,
      maxLength: 30,
    }),
    categoryId: t.String({ error: "Category id is required" }),
  }),
  "route.createTask": t.Object({
    start: t.RegExp(regexISO8601Date, {
      error: "Start date is required. Example: 2021-08-22T10:32:28Z",
    }),
    end: t.RegExp(regexISO8601Date, {
      error: "End date is required. Example: 2021-08-22T10:32:28Z",
    }),
    title: t.String({
      error: "Title is required",
      minLength: 3,
      maxLength: 25,
    }),
    description: t.Optional(
      t.String({
        error: "Description should be between 10 and 100 characters",
        minLength: 10,
        maxLength: 100,
      })
    ),
    categoryId: t.String({ error: "Category id is required" }),
    subCategoryId: t.Optional(t.String()),
    color: t.RegExp(regexHexadecimal, {
      error: "Invalid hexadecimal color code",
    }),
  }),
};
