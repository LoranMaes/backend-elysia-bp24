import Elysia from "elysia";

const taskRoutes = new Elysia();

taskRoutes
  .get("/", () => {
    return { message: "Get all tasks" };
  })
  .get("/:id", () => {
    return { message: "Get task by id" };
  })
  .post("/", () => {
    return { message: "Create a task" };
  })
  .put("/:id", () => {
    return { message: "Update a task" };
  })
  .delete("/:id", () => {
    return { message: "Delete a task" };
  });

export default taskRoutes;
