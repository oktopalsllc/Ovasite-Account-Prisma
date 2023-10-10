import { PrismaClient } from '@prisma/client';
import asyncHandler from "express-async-handler";

const prisma = new PrismaClient();


// Creates a report
const createReport = asyncHandler(async(req, res) => {
    const { 
        title, 
        reportData, 
        description, 
        status, 
        creatorId, 
        formId, 
        submissionId, 
        projectId 
    } = req.body;
    const newReport = await prisma.report.create({
        data: {
            title,
            reportData,
            description,
            status,
            creatorId,
            formId,
            submissionId,
            projectId
        },
    });
    res.json(newReport);
});

// Get a report by its id
const getReport = asyncHandler(async(req, res) => {
    const { id } = req.params;
    const report = await prisma.report.findUnique({
        where: {
            id: id
        },
    });
    res.json(report);
});

// Get reports related to a project
const getReports = asyncHandler(async(req, res) => {
    const { projectId } = req.params;
    const reports = await prisma.report.findMany({
        where: {
            projectId: projectId
        },
    });
    res.json(reports);
});

// Get reports by an employee
const getReportsByEmployee = asyncHandler(async(req, res) => {
    const { creatorId } = req.params;
    const reports = await prisma.report.findMany({
        where: {
            creatorId: creatorId
        },
    });
    res.json(reports);
});

// Get reports related to a submission
const getSubmissionReports = asyncHandler(async(req, res) => {
    const { submissionId } = req.params;
    const reports = await prisma.report.findMany({
        where: {
            submissionId: submissionId
        },
    });
    res.json(reports);
});

// Update a report
const updateReport = asyncHandler(async(req, res) => {
    const { id, title, reportData, description, status } = req.body;
    const updatedReport = await prisma.report.update({
        where: {
            id: id
        },
        data: {
            title,
            reportData,
            description,
            status
        },
    });
    res.json(updatedReport);
});

// Delete a report
const deleteReport = asyncHandler(async(req, res) => {
    const { id } = req.params;
    const deletedReport = await prisma.report.delete({
        where: {
            id: id
        },
    });
    res.json(deletedReport);
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