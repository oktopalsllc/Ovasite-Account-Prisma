import{ 
    createReport,
    getReport,
    getReports,
    getReportsByEmployee,
    getSubmissionReports,
    updateReport,
    deleteReport
} from './report.controller.js';
import express from "express";

import { 
    checkOrganizationExists 
} from '../organizations/organizations.middleware.js';
import {
    verifyAdmin,
    verifyUser
} from "../middleware/authenticate.js";

const reportRouter = express.Router({ mergeParams: true });

reportRouter.use('/:orgId', verifyUser);
reportRouter.use('/:orgId', checkOrganizationExists);

reportRouter.post('/:orgId/report/create', createReport);
reportRouter.get('/:orgId/report/:reportId', getReport);
reportRouter.get('/:orgId/reports/:projectId', getReports);
reportRouter.get('/:orgId/userreports/:employeeId/:projectId', getReportsByEmployee);
reportRouter.get('/:orgId/submissionreports/:submissionId', getSubmissionReports);
reportRouter.patch('/:orgId/update/report/:reportId', updateReport);
reportRouter.delete('/:orgId/delete/report/:reportId', deleteReport);

export default reportRouter;
