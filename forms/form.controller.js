import { PrismaClient } from '@prisma/client';
import asyncHandler from "express-async-handler";
import { 
    ForbiddenError, 
    NotFoundError
} from '../middleware/errors.js';
import { createAuditLog } from '../helpers/auditHelper.js';

const prisma = new PrismaClient();

// Creates a form
const createForm = asyncHandler(async(req, res, next) => {
    try{
        const orgId = req.params.orgId;
        if (!req.user || req.user.organizationId !== orgId) {
            throw new ForbiddenError('User is not allowed to create a form for this organization');
        }
        const { title, formData, description, creatorId, projectId } = req.body;
        const newForm = await prisma.form.create({
            data: {
                title,
                formData,
                description,
                creatorId,
                orgId,
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
        res.json({message:'Form created successfully', status: true, newForm});
    }
    catch(err){
        next(err);
    }
});

// Gets a form by its id
const getForm = asyncHandler(async(req, res, next) => {
    try{
        const orgId = req.params.orgId;
        if (!req.user || req.user.organizationId !== orgId) {
            throw new ForbiddenError('User is not within organization');
        }
        const { id } = req.params.formId;
        const form = await prisma.form.findUnique({
            where: {
                id: id,
            },
        });
        if(!form) throw new NotFoundError('Form not found');
        res.json(form);
    }
    catch(err){
        next(err);
    }
});

// Gets forms related to a project
const getForms = asyncHandler(async(req, res, next) => {
    try{
        const orgId = req.params.orgId;
        if (!req.user || req.user.organizationId !== orgId) {
            throw new ForbiddenError('User is not within organization');
        }
        const { projectId } = req.params.projectId;
        const forms = await prisma.form.findMany({
            where: {
                projectId: projectId
            },
        });
        if(forms.length === 0) throw new NotFoundError('No forms for this project found');
        res.json(forms);
    }
    catch(err){
        next(err);
    }
});

// Gets forms by an employee
const getFormsByEmployee = asyncHandler(async(req, res, next) => {
    try{
        const { orgId, creatorId, projectId } = req.params;        
        if (!req.user || req.user.organizationId !== orgId) {
            throw new ForbiddenError('User is not within organization');
        }
        const forms = await prisma.form.findMany({
            where: {
                organizationId: orgId,
                creatorId: creatorId,
                projectId: projectId
            },
        });
        if(forms.length === 0) throw new NotFoundError('No forms for this project found');
        res.json(forms);
    }
    catch(err){
        next(err);
    }
});

// Updates a form
const updateForm = asyncHandler(async(req, res, next) => {
    try{
        const orgId = req.params.orgId;
        if (!req.user || req.user.organizationId !== orgId) {
            throw new ForbiddenError('User is not within organization');
        }
        const id = req.params.formId;
        const { title, formData, description } = req.body;
        const oldValues = await prisma.form.findUnique({
            where: {
                id: id,
            },
        });
        const updatedForm = await prisma.form.update({
            where: {
                id: id
            },
            data: {
                title,
                formData,
                description
            },
        });
        if(!updatedForm) throw new NotFoundError('Form does not exist'); 
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
        res.json({message: 'Form updated successfully', status: true, updatedForm});
    }
    catch(err){
        next(err);
    }
});

// Deletes a form
const deleteForm = asyncHandler(async(req, res, next) => {
    try{
        const orgId = req.params.orgId;
        if (!req.user || req.user.organizationId !== orgId) {
            throw new ForbiddenError('User is not within organization');
        }
        const { id } = req.params.formId;
        const deletedForm = await prisma.form.delete({
            where: {
                id: id
            },
        });
        if(!deletedForm) throw new NotFoundError('Form does not exist');
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
        res.json({message: 'Form deleted successfully', status: true, deletedForm});
    }
    catch(err){
        next(err);
    }
});

// Export endpoints
export{
    createForm,
    getForm,
    getForms,
    getFormsByEmployee,
    updateForm,
    deleteForm
};