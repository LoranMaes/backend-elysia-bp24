import Elysia from "elysia";
import { generalSchema } from "../routeValidators";
import { AdminService } from "../../services/admin.service";
import { UserService } from "../../services/user.service";

const adminRoutes = new Elysia({ prefix: "/admin" });
const Admin = AdminService;
const US = UserService;

adminRoutes
  .model(generalSchema)
  .get("/users", async ({}) => {
    await Admin.getUsers();
    return { message: "Get all users" };
  })
  .get(
    "/users/:id",
    ({ params }) => {
      return { message: "Get user by id" };
    },
    { params: "route.id" }
  )
  .post("/users", ({}) => {
    return { message: "Create new user" };
  })
  .delete(
    "/users/:id",
    ({ params }) => {
      return { message: "Delete user by id" };
    },
    { params: "route.id" }
  )
  .post(
    "/categories",
    async ({ body, error }) => {
      try {
        return await US.createCategory(body);
      } catch (err) {
        return error(500, err);
      }
    },
    {
      body: "route.createCategory",
      type: "multipart/form-data",
    }
  );

export default adminRoutes;
