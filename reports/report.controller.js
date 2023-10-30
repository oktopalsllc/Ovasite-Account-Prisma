import { PrismaClient } from '@prisma/client';
import asyncHandler from "express-async-handler";
import { 
    NotFoundError
} from '../middleware/errors.js';
import { createAuditLog } from '../helpers/auditHelper.js';

const prisma = new PrismaClient();


// Creates a report
const createReport = asyncHandler(async(req, res, next) => {
    try {
        const orgId = req.params.orgId;
        const { 
            title, 
            reportData, 
            creatorId, 
            projectId 
        } = req.body;
        const newReport = await prisma.report.create({
            data: {
                title,
                reportData,
                orgId,
                creatorId,
                projectId
            },
        });
        await createAuditLog(
            req.user.email, 
            req.ip || null, 
            orgId,
            'create',
            'Report',
            '',
            JSON.stringify(newReport),
            newReport.id.toString()
        );
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

// Update a report
const updateReport = asyncHandler(async(req, res, next) => {
    try {
        const {orgId, id} = req.params;
        const { title, reportData } = req.body;
        const oldValues = await prisma.report.findUnique({
            where: {
                id: id,
            },
        });
        const updatedReport = await prisma.report.update({
            where: {
                id: id
            },
            data: {
                title,
                reportData,
                updatedAt: new Date(),
            },
        });        
        if(!updatedReport) throw new NotFoundError('Report found');
        await createAuditLog(
            req.user.email, 
            req.ip || null, 
            orgId,
            'update',
            'Report',
            JSON.stringify(oldValues),
            JSON.stringify(updatedReport),
            oldValues.id.toString()
        );
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
        const {orgId, id} = req.params;
        const deletedReport = await prisma.report.delete({
            where: {
                id: id
            },
        });
        if(!deletedReport) throw new NotFoundError('Report found');
        await createAuditLog(
            req.user.email, 
            req.ip || null, 
            orgId,
            'delete',
            'Report',
            JSON.stringify(deletedReport),
            '',
            deletedReport.id.toString()
        );
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

export { 
    createReport,
    getReport,
    getReports,
    getReportsByEmployee,
    updateReport,
    deleteReport
};