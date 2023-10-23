import { PrismaClient } from '@prisma/client';
import asyncHandler from "express-async-handler";
import { 
    ForbiddenError, 
    NotFoundError,
    InternalServerError
} from '../middleware/errors.js';
import { createObjectCsvWriter } from 'csv-writer';
import { createAuditLog } from '../helpers/auditHelper.js';

const prisma = new PrismaClient();

// Create a submission
const createSubmission = asyncHandler(async(req, res, next) => {
    try{
        const orgId = req.params.orgId;
        if (!req.user || req.user.organizationId !== orgId) {
            throw new ForbiddenError('User is not allowed to create a submission for this organization');
        }
        const { 
            title, 
            description, 
            submissionData, 
            geolocation, 
            creatorId, 
            formId, 
            projectId 
        } = req.body;
        const newSubmission = await prisma.submission.create({
            data: {
                title,
                description,
                submissionData,
                geolocation,
                creatorId,
                orgId,
                formId,
                projectId
            },
        });
        await createAuditLog(
            req.user.email, 
            req.ip || null, 
            orgId,
            'create',
            'Submission',
            '',
            JSON.stringify(newSubmission),
            newSubmission.id.toString()
        );
        res.json({message: 'Submission created successfully', status: true, newSubmission});
    }
    catch(err){
        next(err);
    }
});

// Get submission by its id
const getSubmission = asyncHandler(async(req, res, next) => {
    try{
        const orgId = req.params.orgId;
        if (!req.user || req.user.organizationId !== orgId) {
            throw new ForbiddenError('User is not within organization');
        }
        const { id } = req.params.submissionId;
        const submission = await prisma.submission.findUnique({
            where: {
                id: id
            },
        });
        if(!submission) throw new NotFoundError('Submission not found');
        res.json(submission);
    }
    catch(err){
        next(err);
    }
});

// Get submissions by project id
const getSubmissions = asyncHandler(async(req, res, next) => {
    try{
        const orgId = req.params.orgId;
        if (!req.user || req.user.organizationId !== orgId) {
            throw new ForbiddenError('User is not within organization');
        }
        const { projectId } = req.params.projectId;
        const submissions = await prisma.submission.findMany({
            where: {
                projectId: projectId
            },
        });
        if(submissions.length === 0) throw new NotFoundError('No submissions found for this form');
        res.json(submissions);
    }
    catch(err){
        next(err);
    }
});

// Get submissions by form id
const getFormSubmissions = asyncHandler(async(req, res, next) => {
    try{ 
        const orgId = req.params.orgId;
        if (!req.user || req.user.organizationId !== orgId) {
            throw new ForbiddenError('User is not within organization');
        }
        const { formId } = req.params.formId;
        const submissions = await prisma.submission.findMany({
            where: {
                formId: formId
            },
        });
        if(submissions.length === 0) throw new NotFoundError('No submissions found for this form');
        res.json(submissions);
    }
    catch(err){
        next(err);
    }
});

// Get submissions by employee
const getEmployeeSubmissions = asyncHandler(async(req, res, next) => {
    try{
        const orgId = req.params.orgId;
        if (!req.user || req.user.organizationId !== orgId) {
            throw new ForbiddenError('User is not within organization');
        }
        const creatorId  = req.params.employeeId;
        const projectId = req.params.projectId;
        const submissions = await prisma.submission.findMany({
            where: {
                creatorId: creatorId,
                organizationId: orgId,
                projectId: projectId
            },
        });
        if(submissions.length === 0) throw new NotFoundError('No submissions found for this form');
        res.json(submissions);
    }
    catch(err){
        next(err);
    }
});

// Update submission
const updateSubmission = asyncHandler(async(req, res, next) => {
    try{
        const orgId = req.params.orgId;
        if (!req.user || req.user.organizationId !== orgId) {
            throw new ForbiddenError('User is not within organization');
        }
        const id = req.params.submissionId;
        const { title, description, submissionData, geolocation } = req.body;
        const oldValues = await prisma.submission.findUnique({
            where: {
                id: id,
            },
        });
        const updatedSubmission = await prisma.submission.update({
            where: {
                id: id
            },
            data: {
                title,
                description,
                submissionData,
                geolocation
            },
        });
        if(!updatedSubmission) throw new NotFoundError('Submission not found');
        await createAuditLog(
            req.user.email, 
            req.ip || null, 
            orgId,
            'update',
            'Submission',
            JSON.stringify(oldValues),
            JSON.stringify(updatedSubmission),
            updatedSubmission.id.toString()
        );
        res.json({
            message: 'Submission updated successfully',
            status:true,
            updatedSubmission
        });
    }
    catch(err){
        next(err);
    }
});

// Export submission data
const exportSubmission = asyncHandler(async (req, res, next) => {
    try {
        const orgId = req.params.orgId;
        if (!req.user || req.user.organizationId !== orgId) {
            throw new ForbiddenError('User is not within organization');
        }
        const { submissionId } = req.params.submissionId;
        const submission = await prisma.submission.findUnique({
            where: {
                id: submissionId
            },
        });
        if (!submission) throw new NotFoundError('Submission not found');

        // Parse the JSON data in submissionData
        const submissionData = JSON.parse(submission.submissionData);

        // Extract the specified fields
        const { id, title, description, geolocation, creatorId, organizationId, formId, projectId } = submission;

        // Define CSV header and records
        const csvWriter = new createObjectCsvWriter({
            path: 'submission.csv',
            header: [
                { id: 'id', title: 'ID' },
                { id: 'title', title: 'Title' },
                { id: 'description', title: 'Description' },
                { id: 'geolocation', title: 'Geolocation' },
                { id: 'creatorId', title: 'Creator ID' },
                { id: 'organizationId', title: 'Organization ID' },
                { id: 'formId', title: 'Form ID' },
                { id: 'projectId', title: 'Project ID' },
            ]
        });

        const records = [
            {
                id,
                title,
                description,
                geolocation,
                creatorId,
                organizationId,
                formId,
                projectId,
                ...submissionData 
            }
        ];

        csvWriter.writeRecords(records)       
            .then(() => {
                res.download('submission.csv');
            })
            .catch((error) => {
                throw new InternalServerError(error);
            });
    } 
    catch (err) {
        next(err);
    }
});

// Delete submission
const deleteSubmission = asyncHandler(async(req, res, next) => {
    try{
        const orgId = req.params.orgId;
        if (!req.user || req.user.organizationId !== orgId) {
            throw new ForbiddenError('User is not within organization');
        }
        const { id } = req.params.submissionId;
        const deletedSubmission = await prisma.submission.delete({
            where: {
                id: id
            },
        });
        if(!deletedSubmission) throw new NotFoundError('Submission not found');
        await createAuditLog(
            req.user.email, 
            req.ip || null, 
            orgId,
            'delete',
            'Submission',
            JSON.stringify(deletedSubmission),
            '',
            deletedSubmission.id.toString()
        );
        res.json({
            message: 'Submission deleted successfully',
            status: true,
            deletedSubmission
        });
    }
    catch(err){
        next(err);
    }
});

export{
    createSubmission,
    getSubmission,
    getSubmissions,
    getFormSubmissions,
    getEmployeeSubmissions,
    updateSubmission,
    exportSubmission,
    deleteSubmission
};