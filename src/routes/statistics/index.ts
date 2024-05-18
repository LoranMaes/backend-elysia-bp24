import Elysia from "elysia";

const statsRoutes = new Elysia();

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
