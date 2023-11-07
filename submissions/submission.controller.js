import { PrismaClient } from '@prisma/client';
import asyncHandler from "express-async-handler";
import { 
    NotFoundError,
    InternalServerError
} from '../middleware/errors.js';
import { createObjectCsvWriter } from 'csv-writer';
import { createAuditLog } from '../helpers/auditHelper.js';
import axios from 'axios';

const prisma = new PrismaClient();

// Create a submission
const createSubmission = asyncHandler(async(req, res, next) => {
    try{
        const orgId = req.params.orgId;
        const { formValues, formInfo, location } = req.body;
        const { formId } = formInfo;
        const parsedFormId = JSON.parse(formId);
        const { latitude, longitude } = JSON.parse(location);
        const geoData = await axios.get(`https://geocode.maps.co/reverse?lat=${latitude}&lon=${longitude}`);
        const geoDataString = JSON.stringify(geoData.data);
        const form = await prisma.form.findUnique({
            where: {
                id: parsedFormId,
            }
        });
        const newSubmission = await prisma.submission.create({
            data: {
                title: form.title,
                description: form.description,
                submissionData: formValues,
                geolocation: geoDataString,
                creatorId: {connect: {id: req.employeeId}},
                organizationId: orgId,
                formId: parsedFormId,
                projectId: form.projectId
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
        res.status(201).json({message: 'Submission created successfully', status: true, newSubmission});
    }
    catch(err){
        next(err);
    }
});

// Get submission by its id
const getSubmission = asyncHandler(async(req, res, next) => {
    try{
        const { id } = req.params.submissionId;
        const submission = await prisma.submission.findUnique({
            include:{
                employee: true,
                form: true,
                organization: true,
                project: true
            },
            where: {
                id: id
            },
        });
        if(!submission) throw new NotFoundError('Submission not found');
        res.status(201).json(submission);
    }
    catch(err){
        next(err);
    }
});

// Get submissions by project id
const getSubmissions = asyncHandler(async(req, res, next) => {
    try{
        const { projectId } = req.params;
        const submissions = await prisma.submission.findMany({
            include:{
                employee: true,
                form: true,
            },
            where: {
                projectId: projectId
            },
        });
        res.json(submissions);
    }
    catch(err){
        next(err);
    }
});

// Get submissions by form id
const getFormSubmissions = asyncHandler(async(req, res, next) => {
    try{ 
        const { formId } = req.params;
        const submissions = await prisma.submission.findMany({
            include:{
                employee: true,
                project: true
            },
            where: {
                formId: formId
            },
        });
        res.status(201).json(submissions);
    }
    catch(err){
        next(err);
    }
});

// Get submissions by employee
const getEmployeeSubmissions = asyncHandler(async(req, res, next) => {
    try{
        const {orgId, employeeId, projectId} = req.params;
        const submissions = await prisma.submission.findMany({
            include:{
                project: true,
                form: true
            },
            where: {
                creatorId: employeeId,
                organizationId: orgId,
                projectId: projectId
            },
        });
        res.status(201).json(submissions);
    }
    catch(err){
        next(err);
    }
});

// Update submission
const updateSubmission = asyncHandler(async(req, res, next) => {
    try{
        const {orgId, submissionId} = req.params;
        const { title, description, submissionData, geolocation } = req.body;
        const oldValues = await prisma.submission.findUnique({
            where: {
                id: submissionId,
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
                geolocation,
                updatedAt: new Date(),
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
        res.status(201).json({
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
    try{
        const { submissionId } = req.params;
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
        const {orgId, submissionId} = req.params;
        const deletedSubmission = await prisma.submission.delete({
            where: {
                id: submissionId
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
        res.status(201).json({
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