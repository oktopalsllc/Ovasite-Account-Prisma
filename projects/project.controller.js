import { 
    Project, 
    Organization, 
    Employee, 
    EmployeeProjectAssociation,
    PrismaClient 
} from '@prisma/client';
import asyncHandler from "express-async-handler";

const prisma = new PrismaClient();

// Creates a new project
const createProject = asyncHandler(async (req, res) => {
    const { name, description, expectedDuration, status, startDate, endDate, organizationId } = req.body;
    const newProject = await prisma.project.create({
        data: {
            name,
            description,
            expectedDuration,
            status,
            startDate,
            endDate,
            organizationId
        },
    });
    res.json(newProject);
});

// Associates an employee with a project
const addEmployee = asyncHandler(async (req, res) => {
    const { employeeId, projectId, role } = req.body;
    const newAssociation = await prisma.employeeProjectAssociation.create({
        data: {
            employeeId,
            projectId,
            role
        },
    });
    res.json(newAssociation);
});

// Gets list of projects created by an organization
const getOrgProjects = asyncHandler(async (req, res) => {
    const { organizationId } = req.params;
    const projects = await prisma.project.findMany({
        where: {
            organizationId: organizationId
        },
    });
    res.json(projects);
});

// Gets list of projects associated with an employee
const getEmployeeProjects = asyncHandler(async (req, res) => {
    const { employeeId } = req.params;
    const projects = await prisma.employeeProjectAssociation.findMany({
        where: {
            employeeId: employeeId
        },
        include: {
            project: true,
        },
    });
    res.json(projects);
});

// Gets a list of employees associated with an project
const getProjectEmployees = asyncHandler(async (req, res) => {
    const { projectId } = req.params;
    const employees = await prisma.employeeProjectAssociation.findMany({
        where: {
            projectId: projectId
        },
        include: {
            employee: true,
        },
    });
    res.json(employees);
});


// Updates the role of an employee in a project
const editEmployeeRole = asyncHandler(async (req, res) => {
    const { id, role } = req.body;
    const updatedRole = await prisma.employeeProjectAssociation.update({
        where: {
            id: id
        },
        data: {
            role: role
        },
    });
    res.json(updatedRole);
});

// Remove an employee from a project
const removeEmployee = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const deletedAssociation = await prisma.employeeProjectAssociation.delete({
        where: {
            id: id
        },
    });
    res.json(deletedAssociation);
});

// Update a project
const updateProject = asyncHandler(async (req, res) => {
    const { id, name, description, expectedDuration, status, startDate, endDate } = req.body;
    const updatedProject = await prisma.project.update({
        where: {
            id: id
        },
        data: {
            name,
            description,
            expectedDuration,
            status,
            startDate,
            endDate
        },
    });
    res.json(updatedProject);
});

// Exports a project data in json format
const exportProject = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const project = await prisma.project.findUnique({
        where: {
            id: id
        },
    });
    res.json(project);
});

// Delete a project
const deleteProject = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const deletedProject = await prisma.project.delete({
        where: {
            id: id
        },
    });
    res.json(deletedProject);
});

// Export endpoints
module.exports ={
    createProject,
    addEmployee,
    getOrgProjects,
    getEmployeeProjects,
    getProjectEmployees,
    editEmployeeRole,
    removeEmployee,
    updateProject,
    exportProject,
    deleteProject
};