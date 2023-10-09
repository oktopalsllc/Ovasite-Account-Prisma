// local imports
import connectDB from "./config/connectDB.js";
import authRouter from "./auth/auth.routes.js";
import userRouter from "./users/users.routes.js";

import employeeRouter from "./employees/employees.routes.js";
import teamsRouter from "./teams/teams.routes.js";
import inviteRouter from "./invites/invites.routes.js";
import organizationsRouter from "./organizations/organizations.routes.js";
import projectRouter from "./projects/projects.routes.js";
import formRouter from "./form/form.routes.js";
import submissionRouter from "./submissions/submissions.routes";
import reportRouter from "./reports/reports.routes";

export {
  connectDB,
  authRouter,
  userRouter,
  organizationsRouter,
  employeeRouter,
  teamsRouter,
  inviteRouter,
  projectRouter,
  formRouter,
  submissionRouter,
  reportRouter
};
