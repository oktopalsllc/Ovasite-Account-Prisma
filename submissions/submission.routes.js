import {
  createSubmission,
  deleteSubmission,
  exportSubmission,
  getEmployeeSubmissions,
  getFormSubmissions,
  getSubmission,
  getSubmissions,
  updateSubmission,
} from "./submission.controller.js";

import express from "express";
import { getCurrentEmployee } from "../middleware/getCurrentEmployee.js";
import { getCurrentOrganization } from "../middleware/getCurrentOrganization.js";

const submissionRouter = express.Router({ mergeParams: true });

submissionRouter.use("/:orgId", getCurrentOrganization, getCurrentEmployee);

submissionRouter.post("/:orgId/submission/create", createSubmission);
submissionRouter.get("/:orgId/submission/:submissionId", getSubmission);
submissionRouter.get("/:orgId/submissions/:projectId", getSubmissions);
submissionRouter.get("/:orgId/submissions/:formId", getFormSubmissions);
submissionRouter.get(
  "/:orgId/usersubmissions/:employeeId/:projectId",
  getEmployeeSubmissions
);
submissionRouter.patch(
  "/:orgId/submission/update/:submissionId",
  updateSubmission
);
submissionRouter.get(
  "/:orgId/submission/export/:submissionId",
  exportSubmission
);
submissionRouter.delete(
  "/:orgId/submission/delete/:submissionId",
  deleteSubmission
);

export default submissionRouter;
