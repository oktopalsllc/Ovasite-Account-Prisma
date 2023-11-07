// local imports
import authRouter from "./auth/auth.routes.js";
import userRouter from "./users/users.routes.js";
import employeeRouter from "./employees/employees.routes.js";
import inviteRouter from "./invites/invites.routes.js";
import organizationsRouter from "./organizations/organizations.routes.js";
import projectRouter from "./projects/project.routes.js";
import formRouter from "./forms/form.routes.js";
import submissionRouter from "./submissions/submission.routes.js";
import reportRouter from "./reports/report.routes.js";
import auditRouter from "./audits/audit.routes.js";
import aiRouter from "./ai/ai.routes.js";

export {
  authRouter,
  userRouter,
  organizationsRouter,
  employeeRouter,
  inviteRouter,
  projectRouter,
  formRouter,
  submissionRouter,
  reportRouter,
  auditRouter,
  aiRouter,
};
