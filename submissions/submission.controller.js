import { PrismaClient } from '@prisma/client';
import asyncHandler from "express-async-handler";

const prisma = new PrismaClient();

// Create a submission
const createSubmission = asyncHandler(async(req, res) => {
    const { title, description, submissionData, creatorId, formId, projectId } = req.body;
    const newSubmission = await prisma.submission.create({
        data: {
            title,
            description,
            submissionData,
            creatorId,
            formId,
            projectId
        },
    });
    res.json(newSubmission);
});

// Get submission by its id
const getSubmission = asyncHandler(async(req, res) => {
    const { id } = req.params;
    const submission = await prisma.submission.findUnique({
        where: {
            id: id
        },
    });
    res.json(submission);
});

// Get submissions by form id
const getFormSubmissions = asyncHandler(async(req, res) => {
    const { formId } = req.params;
    const submissions = await prisma.submission.findMany({
        where: {
            formId: formId
        },
    });
    res.json(submissions);
});

// Get submissions by project id
const getSubmissions = asyncHandler(async(req, res) => {
    const { projectId } = req.params;
    const submissions = await prisma.submission.findMany({
        where: {
            projectId: projectId
        },
    });
    res.json(submissions);
});

// Get a single submission by employee with submission id
const getEmployeeSubmission = asyncHandler(async(req, res) => {
    const { creatorId, id } = req.params;
    const submission = await prisma.submission.findUnique({
        where: {
            id: id,
            creatorId: creatorId
        },
    });
    res.json(submission);
});

// Get submissions by employee
const getEmployeeSubmissions = asyncHandler(async(req, res) => {
    const { creatorId } = req.params;
    const submissions = await prisma.submission.findMany({
        where: {
            creatorId: creatorId
        },
    });
    res.json(submissions);
});

// Update submission
const updateSubmission = asyncHandler(async(req, res) => {
    const { id, title, description, submissionData } = req.body;
    const updatedSubmission = await prisma.submission.update({
        where: {
            id: id
        },
        data: {
            title,
            description,
            submissionData
        },
    });
    res.json(updatedSubmission);
});

// Export submission data
const exportSubmission = asyncHandler(async(req, res) => {
    const { id } = req.params;
    const submission = await prisma.submission.findUnique({
        where: {
            id: id
        },
    });
    res.json(submission);
});

// Delete submission
const deleteSubmission = asyncHandler(async(req, res) => {
    const { id } = req.params;
    const deletedSubmission = await prisma.submission.delete({
        where: {
            id: id
        },
    });
    res.json(deletedSubmission);
});

module.exports = {
    createSubmission,
    getSubmission,
    getSubmissions,
    getFormSubmissions,
    getEmployeeSubmission,
    getEmployeeSubmissions,
    updateSubmission,
    exportSubmission,
    deleteSubmission
};