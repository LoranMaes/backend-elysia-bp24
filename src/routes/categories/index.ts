import Elysia from "elysia";

const catRoutes = new Elysia({ prefix: "/categories" });

catRoutes
  .get("/", () => {
    return { message: "Get all categories" };
  })
  .post("/", () => {
    return { message: "Create a category" };
  });

export default catRoutes;
