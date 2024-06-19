import Elysia from "elysia";

const statsRoutes = new Elysia({ prefix: "/statistics" });

// TODO: If researchers want specific statistics, they can use these routes
statsRoutes
  .get("/daily", () => {
    return { message: "Get daily statistics" };
  })
  .get("/weekly", () => {
    return { message: "Get weekly statistics" };
  })
  .get("/monthly", () => {
    return { message: "Get monthly statistics" };
  })
  .get("/yearly", () => {
    return { message: "Get yearly statistics" };
  })
  .get("/overview", () => {
    return { message: "Get overview statistics" };
  });

export default statsRoutes;
