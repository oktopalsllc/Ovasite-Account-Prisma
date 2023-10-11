import{ 
    createReport,
    getReport,
    getReports,
    getReportsByEmployee,
    getSubmissionReports,
    updateReport,
    deleteReport
} from './report.controller';
import express from "express";

const reportRouter = express.Router();

reportRouter.post('/create', createReport);
reportRouter.get('/report/:reportId', getReport);
reportRouter.get('/getreports/:projectId', getReports);
reportRouter.get('/employeereports/:employeeId', getReportsByEmployee);
reportRouter.get('/submissionreports/:submissionId', getSubmissionReports);
reportRouter.patch('/update/:reportId', updateReport);
reportRouter.delete('/delete/:reportId', deleteReport);

export default reportRouter;
