import Elysia from "elysia";
import authRoutes from "./auth";
import taskRoutes from "./tasks";
import statsRoutes from "./statistics";
import catRoutes from "./categories";
import adminRoutes from "./admin";

const apiRoutes = new Elysia({ prefix: "/api" });

apiRoutes.use(authRoutes).guard({}, (app) =>
  app
    .use(taskRoutes)
    .use(statsRoutes)
    .use(catRoutes)
    .guard({}, (app) => app.use(adminRoutes))
);

export default apiRoutes;
