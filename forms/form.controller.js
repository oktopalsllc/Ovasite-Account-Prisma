import { PrismaClient } from '@prisma/client';
import asyncHandler from "express-async-handler";
import {
    NotFoundError
} from '../middleware/errors.js';
import { createAuditLog } from '../helpers/auditHelper.js';

const prisma = new PrismaClient();

// Creates a form
const createForm = asyncHandler(async (req, res, next) => {
    try {
        const orgId = req.params.orgId;
        const { title, description, projectId } = req.body;
        const newForm = await prisma.form.create({
            data: {
                title,
                description,
                creatorId: {connect: {id: req.employeeId}},
                organizationId: orgId,
                projectId
            },
        });
        await createAuditLog(
            req.user.email,
            req.ip || null,
            orgId,
            'create',
            'Form',
            '',
            JSON.stringify(newForm),
            newForm.id.toString()
        );
        res.status(201).json({ message: 'Form created successfully', status: true, newForm });
    }
    catch (err) {
        next(err);
    }
});

// Gets a form by its id
const getForm = asyncHandler(async (req, res, next) => {
    try {
        const { formId } = req.params;
        const form = await prisma.form.findUnique({
            where: {
                id: formId,
            },
        });
        if (!form) throw new NotFoundError('Form not found');
        res.status(201).json(form);
    }
    catch (err) {
        next(err);
    }
});

// Get form content(formData) by formId
const getFormData = asyncHandler(async (req, res, next) => {
    try {
        const { formId } = req.params;
        const form = await prisma.form.findUnique({
            select: {
                formData: true
            },
            where: {
                id: formId,
            },
        });
        if (!form) throw new NotFoundError('Form not found');
        res.status(201).json(form);
    }
    catch (err) {
        next(err);
    }
});

// Gets form with its submissions
const getFormWithSubmissions = asyncHandler(async (req, res, next) => {
    try {
        const { formId } = req.params;
        const form = await prisma.form.findUnique({
            include: {
                submissions: true
            },
            where: {
                id: formId,
            },
        });
        if (!form) throw new NotFoundError('Form not found');
        res.json(form);
    }
    catch (err) {
        next(err);
    }
});

// Gets forms related to a project
const getForms = asyncHandler(async (req, res, next) => {
    try {
        const { projectId } = req.params;
        const forms = await prisma.form.findMany({
            where: {
                projectId: projectId
            },
        });
        res.status(201).json(forms);
    }
    catch (err) {
        next(err);
    }
});

// Gets forms by an employee
const getFormsByEmployee = asyncHandler(async (req, res, next) => {
    try {
        const { orgId, creatorId, projectId } = req.params;
        const forms = await prisma.form.findMany({
            where: {
                organizationId: orgId,
                creatorId: creatorId,
                projectId: projectId
            },
        });
        res.status(201).json(forms);
    }
    catch (err) {
        next(err);
    }
});

// Publish a form
const publishForm = asyncHandler(async (req, res, next) => {
    try {
        const { orgId, id } = req.params;
        const oldValues = await prisma.form.findUnique({
            where: {
                id: id,
            },
        });
        const publishedForm = await prisma.form.update({
            where: { id: formId },
            data: {
                published: true,
                updatedAt: new Date(),
            },
        });
        if (!publishedForm) throw new NotFoundError('Form not found');
        await createAuditLog(
            req.user.email,
            req.ip || null,
            orgId,
            'publish',
            'Form',
            JSON.stringify(oldValues),
            JSON.stringify(publishedForm),
            oldValues.id.toString()
        );
        res.status(201).json(publishedForm);
    }
    catch (err) {
        next(err);
    }
});

// Updates a form
const updateForm = asyncHandler(async (req, res, next) => {
    try {
        const { orgId, formId } = req.params;
        const { title, description, formData } = req.body;
        const oldValues = await prisma.form.findUnique({
            where: {
                id: formId,
            },
        });
        const updatedForm = await prisma.form.update({
            where: {
                id: formId
            },
            data: {
                title,
                description,
                formData,
                updatedAt: new Date(),
            },
        });
        if (!updatedForm) throw new NotFoundError('Form does not exist');
        await createAuditLog(
            req.user.email,
            req.ip || null,
            orgId,
            'update',
            'Form',
            JSON.stringify(oldValues),
            JSON.stringify(updateForm),
            oldValues.id.toString()
        );
        res.status(201).json({ message: 'Form updated successfully', status: true, updatedForm });
    }
    catch (err) {
        next(err);
    }
});

// Deletes a form
const deleteForm = asyncHandler(async (req, res, next) => {
    try {
        const { orgId, formId } = req.params;
        const deletedForm = await prisma.form.delete({
            where: {
                id: formId
            },
        });
        if (!deletedForm) throw new NotFoundError('Form does not exist');
        await createAuditLog(
            req.user.email,
            req.ip || null,
            orgId,
            'delete',
            'Form',
            JSON.stringify(deletedForm),
            '',
            deletedForm.id.toString()
        );
        res.status(201).json({ message: 'Form deleted successfully', status: true, deletedForm });
    }
    catch (err) {
        next(err);
    }
});

// Export endpoints
export {
    createForm,
    getForm,
    getFormData,
    getFormWithSubmissions,
    getForms,
    getFormsByEmployee,
    publishForm,
    updateForm,
    deleteForm
};