import Elysia from "elysia";
import authRoutes from "./auth";
import taskRoutes from "./tasks";
import statsRoutes from "./statistics";
import catRoutes from "./categories";
import adminRoutes from "./admin";
import bearer from "@elysiajs/bearer";

const apiRoutes = new Elysia();

apiRoutes
  .group("/auth", (app) => app.use(authRoutes))
  .use(bearer())
  .guard({}, (app) =>
    app
      .group("/tasks", (app) => app.use(taskRoutes))
      .group("/statistics", (app) => app.use(statsRoutes))
      .group("/categories", (app) => app.use(catRoutes))
      .guard({}, (app) => app.group("/admin", (app) => app.use(adminRoutes)))
  );

export default apiRoutes;
