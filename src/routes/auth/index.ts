import Elysia from "elysia";
import { generalSchema } from "../schema";
import { AuthService } from "../../services/auth.service";

const authRoutes = new Elysia({ prefix: "/auth" });
const Auth = AuthService;

authRoutes
  .model(generalSchema)
  .post(
    "/register",
    async ({ body, error }) => {
      let user = null;
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
    async ({ body }) => {
      const user = await Auth.login(body);
      return { message: "User logged in", data: body };
    },
    {
      body: "route.login",
    }
  )
  .post("/logout", () => Auth.logout());

export default authRoutes;
