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
reportRouter.get('/:orgId/reports/submission/:submissionId', getSubmissionReports);
reportRouter.patch('/:orgId/report/update/:reportId', updateReport);
reportRouter.delete('/:orgId/report/delete/:reportId', deleteReport);

export default reportRouter;
