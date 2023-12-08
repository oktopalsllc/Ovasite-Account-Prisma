import express from "express";
import { getCurrentOrganization } from "../middleware/getCurrentOrganization.js";
import {
  deleteAuditLog,
  deleteOrgAuditLog,
  getAuditLog,
  getAuditLogs,
  getOrgAuditLogs,
} from "./audit.controller.js";
const auditRouter = express.Router({ mergeParams: true });

auditRouter.use("/:orgId", getCurrentOrganization);

auditRouter.get("/:orgId/audits", getAuditLogs);
auditRouter.get("/:orgId/orgaudits", getOrgAuditLogs);
auditRouter.get("/:orgId/audit/:auditId", getAuditLog);
auditRouter.delete("/:orgId/audit/delete/:auditId", deleteAuditLog);
auditRouter.delete("/:orgId/orgaudit/delete/:auditId", deleteOrgAuditLog);

export default auditRouter;
