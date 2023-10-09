import { PrismaClient } from '@prisma/client';
import asyncHandler from "express-async-handler";

const prisma = new PrismaClient();

// Creates a form
const createForm = asyncHandler(async(req, res) => {
    const { title, formData, description, creatorId, projectId } = req.body;
    const newForm = await prisma.form.create({
        data: {
            title,
            formData,
            description,
            creatorId,
            projectId
        },
    });
    res.json(newForm);
});

// Gets a form by its id
const getForm = asyncHandler(async(req, res) => {
    const { id } = req.params;
    const forms = await prisma.form.findUnique({
        where: {
            id: id,
        },
    });
    res.json(forms);
});

// Gets forms related to a project
const getForms = asyncHandler(async(req, res) => {
    const { projectId } = req.params;
    const forms = await prisma.form.findMany({
        where: {
            projectId: projectId
        },
    });
    res.json(forms);
});

// Gets a form by an employee
const getFormByEmployee = asyncHandler(async(req, res) => {
    const { creatorId, id } = req.params;
    const forms = await prisma.form.findUnique({
        where: {
            id: id,
            creatorId: creatorId
        },
    });
    res.json(forms);
});

// Gets forms by an employee
const getFormsByEmployee = asyncHandler(async(req, res) => {
    const { creatorId } = req.params;
    const forms = await prisma.form.findMany({
        where: {
            creatorId: creatorId
        },
    });
    res.json(forms);
});

// Updates a form
const updateForm = asyncHandler(async(req, res) => {
    const { id, title, formData, description } = req.body;
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
    res.json(updatedForm);
});

// Deletes a form
const deleteForm = asyncHandler(async(req, res) => {
    const { id } = req.params;
    const deletedForm = await prisma.form.delete({
        where: {
            id: id
        },
    });
    res.json(deletedForm);
});

// Export endpoints
module.exports = {
    createForm,
    getForm,
    getForms,
    getFormByEmployee,
    getFormsByEmployee,
    updateForm,
    deleteForm
};