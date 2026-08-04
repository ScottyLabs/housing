import { Elysia, t } from "elysia";
import { sessionAuth } from "../auth/middleware.ts";

export const meRoute = new Elysia().use(sessionAuth).get(
  "/me",
  ({ user, set }) => {
    if (!user) {
      set.status = 401;
      return { error: "Unauthorized" };
    }
    return user;
  },
  {
    response: {
      200: t.Object({
        id: t.Integer(),
        name: t.String(),
        andrewId: t.String(),
        oidcSubject: t.String(),
        createdTime: t.Date(),
      }),
      401: t.Object({ error: t.String() }),
    },
  },
);
