import Elysia from "elysia";

const authRoutes = new Elysia();

authRoutes
  .post("/register", () => {
    return { message: "Register route" };
  })
  .post("/login", () => {
    return { message: "Login route" };
  })
  .post("/logout", () => {
    return { message: "Logout route" };
  })
  .post("/refresh-token", () => {
    return { message: "Refresh token route" };
  });

export default authRoutes;
