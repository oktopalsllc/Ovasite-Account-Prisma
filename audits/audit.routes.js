import{
    getAuditLogs,
    getOrgAuditLogs,
    getAuditLog,
    deleteAuditLog
} from './audit.controller.js';
import express from "express";
import { 
    checkOrganizationExists 
} from '../organizations/organizations.middleware.js';
import {
    verifyAdmin,
    verifyUser
} from "../middleware/authenticate.js";
const auditRouter = express.Router({ mergeParams: true });

auditRouter.use('/:orgId', verifyUser);
auditRouter.use('/:orgId', checkOrganizationExists);

auditRouter.get('/:orgId/audits', getAuditLogs);
auditRouter.get('/:orgId/orgaudits', getOrgAuditLogs);
auditRouter.get('/:orgId/audit/:auditId', getAuditLog);
auditRouter.delete('/:orgId/audit/delete/:auditId', deleteAuditLog);

export default auditRouter;