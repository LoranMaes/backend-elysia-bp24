import Elysia from "elysia";
import authRoutes from "./auth";
import taskRoutes from "./tasks";
import statsRoutes from "./statistics";
import catRoutes from "./categories";
import adminRoutes from "./admin";

const apiRoutes = new Elysia();

apiRoutes
  .group("/auth", (app) => app.use(authRoutes))
  .group("/tasks", (app) => app.use(taskRoutes))
  .group("/statistics", (app) => app.use(statsRoutes))
  .group("/categories", (app) => app.use(catRoutes))
  .group("/admin", (app) => app.use(adminRoutes));

export default apiRoutes;
