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
} from './submission.controller';

import express from "express";

const submissionRouter = express.Router();

submissionRouter.post('/create', createSubmission);
submissionRouter.get('/submission/:submissionId', getSubmission);
submissionRouter.get('/projectsubmissions/:projectId', getSubmissions);
submissionRouter.get('/formsubmissions/:formId', getFormSubmissions);
submissionRouter.get('/employeesubmission/:employeeId/:submissionId', getEmployeeSubmission);
submissionRouter.get('/employeesubmissions/:employeeId', getEmployeeSubmissions);
submissionRouter.patch('/update/:submissionId', updateSubmission);
submissionRouter.get('/export/:submissionId', exportSubmission);
submissionRouter.delete('/delete/:submissionId', deleteSubmission);

export default submissionRouter;