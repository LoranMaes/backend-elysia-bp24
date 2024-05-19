import Elysia from "elysia";
import { generalSchema } from "../schema";

const taskRoutes = new Elysia({ prefix: "/tasks" });

taskRoutes
  .model(generalSchema)
  .get("/", () => {
    return { message: "Get all tasks" };
  })
  .get(
    "/:id",
    ({ params }) => {
      return { message: "Get task by id" };
    },
    { params: "route.id" }
  )
  .post("/", () => {
    return { message: "Create a task" };
  })
  .put(
    "/:id",
    ({ params }) => {
      return { message: "Update a task" };
    },
    { params: "route.id" }
  )
  .delete(
    "/:id",
    ({ params }) => {
      return { message: "Delete a task" };
    },
    { params: "route.id" }
  );

export default taskRoutes;
