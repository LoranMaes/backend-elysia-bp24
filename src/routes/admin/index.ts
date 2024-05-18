import Elysia from "elysia";
import { generalSchema } from "../schema";

const adminRoutes = new Elysia();

adminRoutes
  .model(generalSchema)
  .get("/users", () => {
    return { message: "Get all users" };
  })
  .get(
    "/users/:id",
    ({ params }) => {
      return { message: "Get user by id" };
    },
    { params: "route.id" }
  )
  .post("/users", () => {
    return { message: "Create new user" };
  })
  .delete(
    "/users/:id",
    ({ params }) => {
      return { message: "Delete user by id" };
    },
    { params: "route.id" }
  );

export default adminRoutes;
