// local imports
import connectDB from "./config/connectDB.js";
import authRouter from "./auth/auth.routes.js";
import userRouter from "./users/users.routes.js";

import employeeRouter from "./employees/employees.routes.js";
import teamsRouter from "./teams/teams.routes.js";
import inviteRouter from "./invites/invites.routes.js";
import organizationsRouter from "./organizations/organizations.routes.js";

export {
  connectDB,
  authRouter,
  userRouter,
  organizationsRouter,
  employeeRouter,
  teamsRouter,
  inviteRouter,
};
