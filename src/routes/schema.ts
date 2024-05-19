import { t } from "elysia";
import { regexEmail } from "../libs/regex";

export const generalSchema = {
  "route.id": t.Object({
    id: t.Number(),
  }),
  "route.register": t.Object({
    firstName: t.String(),
    lastName: t.String(),
    email: t.RegExp(regexEmail),
    profilePicture: t.Optional(t.File({ type: "image", maxSize: "2m" })),
    password: t.String(),
  }),
  "route.login": t.Object({
    email: t.String(),
    password: t.String(),
  }),
};
