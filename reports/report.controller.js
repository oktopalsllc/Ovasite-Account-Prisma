import { PrismaClient } from '@prisma/client';
import asyncHandler from "express-async-handler";
import { 
    ForbiddenError, 
    NotFoundError
} from '../middleware/errors.js';

const prisma = new PrismaClient();


// Creates a report
const createReport = asyncHandler(async(req, res, next) => {
    try {
        const orgId = req.params.orgId;
        if (!req.user || req.user.organizationId !== orgId) {
            throw new ForbiddenError('User is not allowed to create a report for this organization');
        }
        const { 
            title, 
            reportData, 
            creatorId, 
            formId, 
            submissionId, 
            projectId 
        } = req.body;
        const newReport = await prisma.report.create({
            data: {
                title,
                reportData,
                creatorId,
                formId,
                submissionId,
                projectId
            },
        });
        res.json({
            message: 'Report created successfully',
            status: true,
            newReport
        });
    } 
    catch (err) {
        next(err);
    }
});

// Get a report by its id
const getReport = asyncHandler(async(req, res, next) => {
    try {
        const orgId = req.params.orgId;
        if (!req.user || req.user.organizationId !== orgId) {
            throw new ForbiddenError('User is not within organization');
        }
        const { id } = req.params.reportId;
        const report = await prisma.report.findUnique({
            where: {
                id: id
            },
        });
        if(!report) throw new NotFoundError('Report found');
        res.json(report);
    } 
    catch (err) {
        next(err);
    }
});

// Get reports related to a project
const getReports = asyncHandler(async(req, res, next) => {
    try {
        const orgId = req.params.orgId;
        if (!req.user || req.user.organizationId !== orgId) {
            throw new ForbiddenError('User is not within organization');
        }
        const { projectId } = req.params.projectId;
        const reports = await prisma.report.findMany({
            where: {
                projectId: projectId
            },
        });
        if(reports.length === 0) throw new NotFoundError('No reports found');
        res.json(reports);
    } 
    catch (err) {
        next(err);
    }
});

// Get reports by an employee
const getReportsByEmployee = asyncHandler(async(req, res, next) => {
    try {
        const orgId = req.params.orgId;
        if (!req.user || req.user.organizationId !== orgId) {
            throw new ForbiddenError('User is not within organization');
        }
        const creatorId  = req.params.employeeId;
        const projectId  = req.params.projectId;
        const reports = await prisma.report.findMany({
            where: {
                creatorId: creatorId,
                projectId: projectId
            },
        });
        if(reports.length === 0) throw new NotFoundError('No reports found');
        res.json(reports);
    } 
    catch (err) {
        next(err);    
    }
});

// Get reports related to a submission
const getSubmissionReports = asyncHandler(async(req, res, next) => {
    try {
        const orgId = req.params.orgId;
        if (!req.user || req.user.organizationId !== orgId) {
            throw new ForbiddenError('User is not within organization');
        }
        const submissionId  = req.params.submissionId;
        const reports = await prisma.report.findMany({
            where: {
                submissionId: submissionId
            },
        });        
        if(reports.length === 0) throw new NotFoundError('No reports found');
        res.json(reports);
    } 
    catch (err) {
        next(err);
    }
});

// Update a report
const updateReport = asyncHandler(async(req, res, next) => {
    try {
        const orgId = req.params.orgId;
        const id = req.params.reportId;
        if (!req.user || req.user.organizationId !== orgId) {
            throw new ForbiddenError('User is not within organization');
        }
        const { title, reportData } = req.body;
        const updatedReport = await prisma.report.update({
            where: {
                id: id
            },
            data: {
                title,
                reportData
            },
        });        
        if(!report) throw new NotFoundError('Report found');
        res.json({
            message: 'Report updated successfully',
            status: true,
            updatedReport
        });
    } 
    catch (err) {
        next(err);
    }
});

// Delete a report
const deleteReport = asyncHandler(async(req, res, next) => {
    try {
        const orgId = req.params.orgId;
        const id = req.params.reportId;
        if (!req.user || req.user.organizationId !== orgId) {
            throw new ForbiddenError('User is not within organization');
        }
        const deletedReport = await prisma.report.delete({
            where: {
                id: id
            },
        });
        if(!report) throw new NotFoundError('Report found');
        res.json({
            message: 'Report deleted successfully',
            status: true,
            deletedReport
        });
    } 
    catch (err) {
        next(err);
    }
});

module.exports = { 
    createReport,
    getReport,
    getReports,
    getReportsByEmployee,
    getSubmissionReports,
    updateReport,
    deleteReport
};