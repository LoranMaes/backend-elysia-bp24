import Elysia, { t } from "elysia";
import { generalSchema } from "../routeValidators";
import { AuthService } from "../../services/auth.service";
import { AdminService } from "../../services/admin.service";

const authRoutes = new Elysia({ prefix: "/auth" });
const Auth = AuthService;
const ADMIN = AdminService;

authRoutes
  .model(generalSchema)
  .get("/user", async ({ cookie: { auth_session } }) => {
    const user = await Auth.getCurrentUser(auth_session.value);
    if (!user) {
      return new Response("You are not logged in", { status: 400 });
    }
    const current_user = ADMIN.getUserById(user.id);
    return {
      message: "User found",
      data: current_user,
    };
  })
  .post(
    "/register",
    async ({ body, error }) => {
      try {
        return await Auth.register(body);
      } catch (err) {
        return error(500, err);
      }
    },
    {
      body: "route.register",
      type: "multipart/form-data",
    }
  )
  .post(
    "/login",
    async ({ body, error }) => {
      try {
        return await Auth.login(body);
      } catch (err) {
        return error(500, err);
      }
    },
    {
      body: "route.login",
      type: "multipart/form-data",
    }
  )
  .post("/logout", async ({ cookie: { auth_session }, error }) => {
    try {
      return await Auth.logout(auth_session);
    } catch (err) {
      return error(500, err);
    }
  });

export default authRoutes;
