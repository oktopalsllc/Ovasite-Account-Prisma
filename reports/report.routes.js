import express from "express";
import {
  createReport,
  deleteReport,
  getReport,
  getReports,
  getReportsByEmployee,
  updateReport,
} from "./report.controller.js";

import { verifyUser } from "../middleware/authenticate.js";
import { checkOrganizationExists } from "../organizations/organizations.middleware.js";

const reportRouter = express.Router({ mergeParams: true });

reportRouter.use("/:orgId", checkOrganizationExists);

reportRouter.post("/:orgId/report/create", createReport);
reportRouter.get("/:orgId/report/:reportId", getReport);
reportRouter.get("/:orgId/reports/:projectId", getReports);
reportRouter.get(
  "/:orgId/userreports/:employeeId/:projectId",
  getReportsByEmployee
);
reportRouter.patch("/:orgId/report/update/:reportId", updateReport);
reportRouter.delete("/:orgId/report/delete/:reportId", deleteReport);

export default reportRouter;
