import Elysia from "elysia";

const adminRoutes = new Elysia();

adminRoutes
  .get("/users", () => {
    return { message: "Get all users" };
  })
  .get("/users/:id", () => {
    return { message: "Get user by id" };
  })
  .post("/users", () => {
    return { message: "Create new user" };
  })
  .delete("/users/:id", () => {
    return { message: "Delete user by id" };
  });

export default adminRoutes;
