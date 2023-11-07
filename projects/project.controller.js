import { PrismaClient } from '@prisma/client';
import asyncHandler from 'express-async-handler';
import { 
    ForbiddenError, 
    NotFoundError, 
    InternalServerError 
} from '../middleware/errors.js';
import { createObjectCsvWriter } from 'csv-writer';
import { createAuditLog } from '../helpers/auditHelper.js';

const prisma = new PrismaClient();

// Creates a new project
const createProject = asyncHandler(async (req, res, next) => {
    try{
        const orgId = req.params.orgId;
        if (!req.user || req.user.organizationId !== orgId) {
            throw new ForbiddenError('User is not allowed to create a project for this organization');
        }
        const { 
            name, 
            description, 
            expectedDuration, 
            status, 
            startDate, 
            endDate
        } = req.body;
        const newProject = await prisma.project.create({
            data: {
                name,
                description,
                expectedDuration,
                status,
                startDate,
                endDate,
                orgId
            },
        });        
        await createAuditLog(
            req.user.email, 
            req.ip || null, 
            orgId,
            'create',
            'Project',
            '',
            JSON.stringify(newProject),
            newProject.id.toString()
        );
        res.json({message: 'Project created successfully', status: true, newProject});
    }
    catch(err){
        next(err);
    }
});

// Associates an employee with a project
const addEmployee = asyncHandler(async (req, res, next) => {
    try{
        const orgId = req.params.orgId;
        if (!req.user || req.user.organizationId !== orgId) {
            throw new ForbiddenError('User is not within organization');
        }
        const projectId = req.params.projectId;
        const { employeeId, role } = req.body;
        const empExists = await prisma.employee.findUnique({
            where: {
                id: employeeId
            },
        });
        const projExists = await prisma.project.findUnique({
            where: {
                id: projectId
            },
        });
        if(!empExists) throw new NotFoundError('Employee does not exist');
        if(!projExists) throw new NotFoundError(`Project ${projectId} does not exist`);
        const newAssociation = await prisma.employeeProjectAssociation.create({
            data: {
                employeeId,
                projectId,
                role
            },
        });
        await createAuditLog(
            req.user.email, 
            req.ip || null,  
            orgId,
            'create',
            'ProjectAssociation',
            '',
            JSON.stringify(newAssociation),
            newAssociation.id.toString()
        );
        res.json({message: 'Employee added successfully', status: true, newAssociation});
    }
    catch(err){
        next(err);
    }
});

// Gets a project created by an organization by its id
const getOrgProject = asyncHandler(async (req, res, next) => {
    try{
        const { orgId, id } = req.params;
        if (!req.user || req.user.organizationId !== orgId) {
            throw new ForbiddenError('User is not within organization');
        }
        const project = await prisma.project.findUnique({
            where: {
                id: id,
                organizationId: orgId
            },
        });
        if(!project) throw new NotFoundError('Project not found');
        res.json(project);
    }
    catch(err){
        next(err);
    }
});

// Gets list of projects created by an organization
const getOrgProjects = asyncHandler(async (req, res) => {
    try{
        const { orgId } = req.params;
        if (!req.user || req.user.organizationId !== orgId) {
            throw new ForbiddenError('User is not within organization');
        }
        const projects = await prisma.project.findMany({
            where: {
                organizationId: orgId
            },
        });
        if(projects.length === 0) throw new NotFoundError('No projects found');
        res.json(projects);
    }
    catch(err){
        next(err);
    }
});

// Gets list of projects associated with an employee
const getEmployeeProjects = asyncHandler(async (req, res, next) => {
    try{
        const orgId = req.params.orgId;
        if (!req.user || req.user.organizationId !== orgId) {
            throw new ForbiddenError('User is not within organization');
        }
        const { employeeId } = req.params.empId;
        const projects = await prisma.employeeProjectAssociation.findMany({
            where: {
                employeeId: employeeId
            },
            include: {
                project: true,
            },
        });
        if(projects.length === 0) throw new NotFoundError('No projects found');
        res.json(projects);
    }
    catch(err){
        next(err);
    }
});

// Gets a list of employees associated with an project
const getProjectEmployees = asyncHandler(async (req, res, next) => {
    try{
        const orgId = req.params.orgId;
        if (!req.user || req.user.organizationId !== orgId) {
            throw new ForbiddenError('User is not within organization');
        }
        const { projectId } = req.params.projectId;
        const employees = await prisma.employeeProjectAssociation.findMany({
            where: {
                projectId: projectId
            },
            include: {
                employee: true,
            },
        });
        if(employees.length === 0) throw new NotFoundError('No employees found');
        res.json(employees);
    }
    catch(err){
        next(err);
    }
});

// Updates the role of an employee in a project
const editEmployeeRole = asyncHandler(async (req, res, next) => {
    try{
        const orgId = req.params.orgId;
        if (!req.user || req.user.organizationId !== orgId) {
            throw new ForbiddenError('User is not within organization');
        }
        const { empId, role } = req.body;
        const projectId = req.params.projectId;
        const oldValues = await prisma.employeeProjectAssociation.findUnique({
            where: {
                employeed: empId,
                projectId: projectId
            },
        });
        const updatedRole = await prisma.employeeProjectAssociation.update({
            where: {
                employeed: empId,
                projectId: projectId
            },
            data: {
                role: role
            },
        });
        if(!updatedRole) throw new NotFoundError('Employee does not exist in this project');
        
        await createAuditLog(
            req.user.email, 
            req.ip || null,  
            orgId,
            'update',
            'ProjectAssociation',
            JSON.stringify(oldValues),
            JSON.stringify(updatedRole),
            oldValues.id.toString()
        );
        res.json({message: 'Role updated successfully', status: true, updatedRole});
    }
    catch(err) {
        next(err);
    }
});

// Remove an employee from a project
const removeEmployee = asyncHandler(async (req, res, next) => {
    try{
        const orgId = req.params.orgId;
        if (!req.user || req.user.organizationId !== orgId) {
            throw new ForbiddenError('User is not within organization');
        }
        const employeeId = req.params.empId;
        const projectId = req.params.projectId;
        const deletedAssociation = await prisma.employeeProjectAssociation.delete({
            where: {
                employeeId: employeeId,
                projectId: projectId
            },
        });
        if(!deletedAssociation) throw new NotFoundError('Employee does not exist in this project');
        await createAuditLog(
            req.user.email, 
            req.ip || null,  
            orgId,
            'delete',
            'ProjectAssociation',
            JSON.stringify(deletedAssociation),
            '',
            deletedAssociation.id.toString()
        );
        res.json({
            message: 'Employee removed from project successfully', 
            status: true, 
            deletedAssociation
        });
    }
    catch(err){
        next(err);
    }
});

// Update a project
const updateProject = asyncHandler(async (req, res, next) => {
    try{
        const orgId = req.params.orgId;
        if (!req.user || req.user.organizationId !== orgId) {
            throw new ForbiddenError('User is not within organization');
        }
        const projectId = req.params.projectId
        const { 
            name, 
            description, 
            expectedDuration, 
            status, 
            isCompleted, 
            startDate, 
            endDate 
        } = req.body;
        const oldValues = await prisma.project.findUnique({
            where: {
                id: projectId
            },
        });
        const updatedProject = await prisma.project.update({
            where: {
                id: projectId
            },
            data: {
                name,
                description,
                expectedDuration,
                status,
                isCompleted,
                startDate,
                endDate
            },
        });
        if(!updatedProject) throw new NotFoundError('Project not found');
        await createAuditLog(
            req.user.email, 
            req.ip || null,  
            orgId,
            'update',
            'Project',
            JSON.stringify(oldValues),
            JSON.stringify(updatedProject),
            oldValues.id.toString()
        );
        res.json({message: 'Project updated successfully', status: true, updatedProject});
    }
    catch (err) {
        next(err);
    }
});

// Exports a project data in json format
const exportProject = asyncHandler(async (req, res, next) => {
    try{
        const orgId = req.params.orgId;
        if (!req.user || req.user.organizationId !== orgId) {
            throw new ForbiddenError('User is not within organization');
        }
        const { id } = req.params.projectId;
        const project = await prisma.project.findUnique({
            where: {
                id: id
            },
        });
        if(!project) throw new NotFoundError('Project not found');

        const csvWriter = new createObjectCsvWriter({
            path: 'project.csv', // Set the desired file name
            header: [ // Define the CSV header
                {id: 'id', title: 'ID'},
                {id: 'orgId', title: 'Organization ID'},
                {id: 'name', title: 'Name'},
                {id: 'description', title: 'Description'},
                {id: 'expectedDuration', title: 'Expected Duration'},
                {id: 'status', title: 'Status'},
                {id: 'isCompleted', title: 'Is Completed?'},
                {id: 'startDate', title: 'Start Date'},
                {id: 'endDate', title: 'End Date'},
            ]
        });
    
        const records = [
            {
                id: project.id,
                orgId: project.organizationId,
                name: project.name,
                description: project.description,
                expectedDuration: project.expectedDuration,
                status: project.status,
                isCompleted: project.isCompleted,
                startDate: project.startDate,
                endDate: project.endDate
            }
        ];

        csvWriter.writeRecords(records)       // returns a promise
        .then(() => {
            res.download('project.csv');   // Send the CSV file as a response
        })
        .catch((error) => {
            throw new InternalServerError(error);
        });
    }
    catch (err) {
        next(err);
    }
});

// Delete a project
const deleteProject = asyncHandler(async (req, res, next) => {
    try{
        const orgId = req.params.orgId;
        if (!req.user || req.user.organizationId !== orgId) {
            throw new ForbiddenError('User is not within organization');
        }
        const { id } = req.params.projectId;
        const deletedProject = await prisma.project.delete({
            where: {
                id: id
            },
        });
        if(!deletedProject) throw new NotFoundError('Project not found');
        await createAuditLog(
            req.user.email, 
            req.ip || null,  
            orgId,
            'delete',
            'Project',
            JSON.stringify(deletedProject),
            '',
            deletedProject.id.toString()
        );
        res.json({message: 'Project deleted', status: true, deletedProject});
    }
    catch (err) {
        next(err);
    }
});

// Export endpoints
export {
    createProject,
    addEmployee,
    getOrgProject,
    getOrgProjects,
    getEmployeeProjects,
    getProjectEmployees,
    editEmployeeRole,
    removeEmployee,
    updateProject,
    exportProject,
    deleteProject
};