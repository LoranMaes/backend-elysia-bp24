import Elysia from "elysia";
import { generalSchema } from "../routeValidators";
import { UserService } from "../../services/user.service";

const USER_SERVICE = UserService;

const taskRoutes = new Elysia({ prefix: "/tasks" });
taskRoutes
  .model(generalSchema)
  .get("/", async ({ cookie: { auth_session } }) => {
    const tasks = await USER_SERVICE.getTasks(auth_session.value || "");
    if (tasks instanceof Response) {
      return tasks;
    }
    return { message: "Tasks fetched successfully", data: tasks };
  })
  .get(
    "/:id",
    async ({ params: { id }, cookie: { auth_session } }) => {
      const task = await USER_SERVICE.getTask(auth_session.value || "", id);
      if (task instanceof Response) {
        return task;
      }
      return { message: "Tasks fetched successfully", data: task };
    },
    { params: "route.id" }
  )
  .post(
    "/",
    async ({ cookie: { auth_session }, error, body }) => {
      try {
        return await USER_SERVICE.createTask(body, auth_session.value || "");
      } catch (err) {
        return error(500, err);
      }
    },
    { body: "route.createTask", type: "multipart/form-data" }
  )
  .delete(
    "/:id",
    async ({ params, cookie: { auth_session }, error }) => {
      try {
        return await USER_SERVICE.deleteTask(auth_session.value, params.id);
      } catch (err) {
        return error(500, err);
      }
    },
    { params: "route.id" }
  );

export default taskRoutes;
