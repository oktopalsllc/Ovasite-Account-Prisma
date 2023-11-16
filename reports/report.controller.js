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
            projectId 
        } = req.body;
        const newReport = await prisma.report.create({
            data: {
                title,
                reportData,
                organization: {connect:{ id: orgId}},
                employee: {connect:{id: req.employeeId}},
                project: {connect:{id: projectId}},
            },
        });
        await createAuditLog(
            req.user.email, 
            req.ip.address() || null, 
            orgId,
            'create',
            'Report',
            '',
            JSON.stringify(newReport),
            newReport.id.toString()
        );
        res.status(201).json({
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
        const { reportId } = req.params;
        const report = await prisma.report.findUnique({
            include: {
                project: true,
                employee: true,
                organization: true
            },
            where: {
                id: reportId
            },
        });
        if(!report) throw new NotFoundError('Report found');
        res.status(201).json(report);
    } 
    catch (err) {
        next(err);
    }
});

// Get reports related to a project
const getReports = asyncHandler(async(req, res, next) => {
    try {
        const { projectId } = req.params;
        const reports = await prisma.report.findMany({
            include: {
                project: true,
                employee: true,
                organization: true
            },
            where: {
                projectId: projectId
            },
        });
        res.status(201).json(reports);
    } 
    catch (err) {
        next(err);
    }
});

// Get reports by an employee
const getReportsByEmployee = asyncHandler(async(req, res, next) => {
    try {
        const {employeeId,projectId}  = req.params;
        const reports = await prisma.report.findMany({
            include: {
                project: true,
                employee: true,
                organization: true
            },
            where: {
                creatorId: employeeId,
                projectId: projectId
            },
        });
        res.status(201).json(reports);
    } 
    catch (err) {
        next(err);    
    }
});

// Update a report
const updateReport = asyncHandler(async(req, res, next) => {
    try {
        const {orgId, reportId} = req.params;
        const { title, reportData } = req.body;
        const oldValues = await prisma.report.findUnique({
            where: {
                id: reportId,
            },
        });
        const updatedReport = await prisma.report.update({
            where: {
                id: reportId
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
            req.ip.address() || null, 
            orgId,
            'update',
            'Report',
            JSON.stringify(oldValues),
            JSON.stringify(updatedReport),
            oldValues.id.toString()
        );
        res.status(201).json({
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
        const {orgId, reportId} = req.params;
        const deletedReport = await prisma.report.delete({
            where: {
                id: reportId
            },
        });
        if(!deletedReport) throw new NotFoundError('Report found');
        await createAuditLog(
            req.user.email, 
            req.ip.address() || null, 
            orgId,
            'delete',
            'Report',
            JSON.stringify(deletedReport),
            '',
            deletedReport.id.toString()
        );
        res.status(201).json({
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