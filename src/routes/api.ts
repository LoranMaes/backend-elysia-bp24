import Elysia from "elysia";
import authRoutes from "./auth";
import taskRoutes from "./tasks";
import statsRoutes from "./statistics";
import catRoutes from "./categories";
import adminRoutes from "./admin";
import { isLoggedInGuard } from "../middleware/middleware";

const apiRoutes = new Elysia({ prefix: "/api" });

apiRoutes.use(authRoutes).guard(
  {
    beforeHandle: async ({ set, cookie: { auth_session } }) => {
      const isLoggedIn = await isLoggedInGuard(auth_session.value);
      if (!isLoggedIn) {
        set.status = "Unauthorized";
        return { message: "You are not logged in" };
      }
    },
  },
  (app) =>
    app
      .use(taskRoutes)
      .use(statsRoutes)
      .use(catRoutes)
      .guard({}, (app) => app.use(adminRoutes))
);

export default apiRoutes;
