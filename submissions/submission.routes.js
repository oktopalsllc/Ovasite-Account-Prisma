import {
    createSubmission,
    getSubmission,
    getSubmissions,
    getFormSubmissions,
    getEmployeeSubmission,
    getEmployeeSubmissions,
    updateSubmission,
    exportSubmission,
    deleteSubmission
} from './submission.controller.js';

import express from "express";
import { 
    checkOrganizationExists 
} from '../organizations/organizations.middleware.js';
import {
    verifyAdmin,
    verifyUser
} from "../middleware/authenticate.js";

const submissionRouter = express.Router({ mergeParams: true });

submissionRouter.use('/:orgId', verifyUser);
submissionRouter.use('/:orgId', checkOrganizationExists);

submissionRouter.post('/:orgId/submission/create', createSubmission);
submissionRouter.get('/:orgId/submission/:submissionId', getSubmission);
submissionRouter.get('/:orgId/submissions/:projectId', getSubmissions);
submissionRouter.get('/:orgId/submissions/:formId', getFormSubmissions);
submissionRouter.get('/:orgId/usersubmission/:employeeId/:submissionId', getEmployeeSubmission);
submissionRouter.get('/:orgId/usersubmissions/:employeeId/:projectId', getEmployeeSubmissions);
submissionRouter.patch('/:orgId/update/submission/:submissionId', updateSubmission);
submissionRouter.get('/:orgId/export/submission/:submissionId', exportSubmission);
submissionRouter.delete('/:orgId/delete/submission/:submissionId', deleteSubmission);

export default submissionRouter;