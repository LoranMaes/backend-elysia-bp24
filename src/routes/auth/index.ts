import Elysia from "elysia";
import { generalSchema } from "../routeValidators";
import { AuthService } from "../../services/auth.service";
import { lucia } from "../../libs/auth";

const authRoutes = new Elysia({ prefix: "/auth" });
const Auth = AuthService;

authRoutes
  .model(generalSchema)
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
