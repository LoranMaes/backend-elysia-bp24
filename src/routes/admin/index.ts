import Elysia from "elysia";
import { generalSchema } from "../routeValidators";
import { AdminService } from "../../services/admin.service";
import { UserService } from "../../services/user.service";

const adminRoutes = new Elysia({ prefix: "/admin" });
const ADMIN = AdminService;
const US = UserService;

adminRoutes
  .model(generalSchema)
  .get("/users", async () => {
    return await ADMIN.getUsers();
  })
  .get(
    "/users/:id",
    ({ params }) => {
      return ADMIN.getUserById(params.id);
    },
    { params: "route.id" }
  )
  .post(
    "/users",
    async ({ body }) => {
      return await ADMIN.createUserByAdmin(body);
    },
    { body: "route.register", type: "multipart/form-data" }
  )
  .delete(
    "/users/:id",
    async ({ params }) => {
      return await ADMIN.deleteUserById(params.id);
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
  )
  .post(
    "/sub-categories",
    async ({ body, error }) => {
      try {
        return await US.createSubCategory(body);
      } catch (err) {
        return error(500, err);
      }
    },
    {
      body: "route.createSubCategory",
      type: "multipart/form-data",
    }
  );

export default adminRoutes;
