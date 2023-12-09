import pkg from "@prisma/client";
import { createObjectCsvWriter } from "csv-writer";
import asyncHandler from "express-async-handler";
import { createAuditLog } from "../helpers/auditHelper.js";
import { InternalServerError, NotFoundError } from "../middleware/errors.js";
import client from "../services/redisClient.js";

const { PrismaClient, ProjectRole } = pkg;
const prisma = new PrismaClient();

// Creates a new project
const createProject = asyncHandler(async (req, res, next) => {
  try {
    const orgId = req.params.orgId;
    const { name, description, expectedDuration, status, startDate, endDate } =
      req.body;

    const newProject = await prisma.project.create({
      data: {
        name,
        description,
        expectedDuration,
        status,
        startDate,
        endDate,
        organization: { connect: { id: orgId } },
        creator: { connect: { id: req.employeeId } },
      },
    });
    await prisma.employeeProjectAssociation.create({
      data: {
        employee: { connect: { id: req.employeeId } },
        project: { connect: { id: newProject.id } },
        role: ProjectRole.MANAGER,
      },
    });
    await createAuditLog(
      req.employeeId,
      req.ip.address || null,
      orgId,
      "create",
      "Project",
      "",
      JSON.stringify(newProject),
      newProject.id.toString()
    );

    res.status(201).json({
      message: "Project created successfully",
      status: true,
      newProject,
    });
  } catch (err) {
    next(err);
  }
});

// Associates an employee with a project
const addEmployee = asyncHandler(async (req, res, next) => {
  try {
    const { orgId, projectId } = req.params;
    const { employeeId, role } = req.body;
    const empExists = await prisma.employee.findUnique({
      where: {
        id: employeeId,
      },
    });
    const projExists = await prisma.project.findUnique({
      where: {
        id: projectId,
      },
    });
    if (!empExists) throw new NotFoundError("Employee does not exist");
    if (!projExists)
      throw new NotFoundError(`Project ${projectId} does not exist`);
    const newAssociation = await prisma.employeeProjectAssociation.create({
      data: {
        employeeId,
        projectId,
        role,
      },
    });
    await createAuditLog(
      req.employeeId,
      req.ip.address || null,
      orgId,
      "create",
      "ProjectAssociation",
      "",
      JSON.stringify(newAssociation),
      newAssociation.id.toString()
    );
    res.status(201).json({
      message: "Employee added successfully",
      status: true,
      newAssociation,
    });
  } catch (err) {
    next(err);
  }
});

// Gets a project created by an organization by its id
const getOrgProject = asyncHandler(async (req, res, next) => {
  const { orgId, projectId } = req.params;
  const cacheKey = `org_project:${orgId}:${projectId}`;
  try {
    const cachedProject = await client.get(cacheKey);
    if (cachedProject) {
      return res
        .status(200)
        .json({ isCached: true, project: JSON.parse(cachedProject) });
    }
    const project = await prisma.project.findUnique({
      include: {
        forms: true,
        submissions: true,
        reports: true,
        projectAssociations: true,
      },
      where: {
        id: projectId,
        organizationId: orgId,
      },
    });
    if (!project) throw new NotFoundError("Project not found");

    await client.set(cacheKey, JSON.stringify(project), { EX: 3600 });
    res.status(201).json({ isCached: false, project });
  } catch (err) {
    next(err);
  }
});

// Gets list of projects created by an organization
const getOrgProjects = asyncHandler(async (req, res, next) => {
  const { orgId } = req.params;
  const cacheKey = `org_project:${orgId}`;
  try {
    const cachedProject = await client.get(cacheKey);
    if (cachedProject) {
      return res
        .status(200)
        .json({ isCached: true, project: JSON.parse(cachedProject) });
    }
    const projects = await prisma.project.findMany({
      include: {
        submissions: true,
        projectAssociations: true,
        organization: true,
        forms: true,
        reports: true,
      },
      where: {
        organizationId: orgId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    await client.set(cacheKey, JSON.stringify(projects), { EX: 120 });
    res.status(201).json({ isCached: false, projects });
  } catch (err) {
    next(err);
  }
});

// Gets list of projects associated with an employee
const getEmployeeProjects = asyncHandler(async (req, res, next) => {
  const { empId } = req.params;
  const cacheKey = `employee_projects:${empId}`;
  try {
    const cachedProjects = await client.get(cacheKey);
    if (cachedProjects) {
      return res
        .status(200)
        .json({ isCached: true, projects: JSON.parse(cachedProjects) });
    }
    const projects = await prisma.employeeProjectAssociation.findMany({
      where: {
        employeeId: empId,
      },
      include: {
        project: true,
      },
    });
    await client.set(cacheKey, JSON.stringify(projects), { EX: 3600 });
    res.status(201).json({ isCached: false, projects });
  } catch (err) {
    next(err);
  }
});

// Gets a list of employees associated with an project
const getProjectEmployees = asyncHandler(async (req, res, next) => {
  const { projectId } = req.params;
  const cacheKey = `project_employees:${projectId}`;
  try {
    const cachedEmployees = await client.get(cacheKey);
    if (cachedEmployees) {
      return res
        .status(200)
        .json({ isCached: true, projects: JSON.parse(cachedEmployees) });
    }
    const employees = await prisma.employeeProjectAssociation.findMany({
      where: {
        projectId: projectId,
      },
      include: {
        employee: true,
      },
    });

    await client.set(cacheKey, JSON.stringify(employees), { EX: 3600 });
    res.status(201).json({ isCached: false, employees });
  } catch (err) {
    next(err);
  }
});

// Get non associated employees
const getAllEmployees = asyncHandler(async (req, res) => {
  const { orgId, projectId } = req.params;
  const cacheKey = `all_employees:${orgId}:${projectId}`;
  try {
    const cachedEmployees = await client.get(cacheKey);
    if (cachedEmployees) {
      return res
        .status(200)
        .json({ isCached: true, projects: JSON.parse(cachedEmployees) });
    }
    const employees = await prisma.employee.findMany({
      where: {
        organizationId: orgId,

        projectAssociations: {
          none: {
            projectId: projectId,
          },
        },
      },
      select: {
        id: true,
        fullName: true,
      },
    });
    await client.set(cacheKey, JSON.stringify(employees), { EX: 3600 });
    res.status(200).json({ isCached: false, employees });
  } catch (err) {
    next(err);
  }
});

// Get project stats
const getProjectStats = asyncHandler(async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const reports = await prisma.report.findMany({
      where: {
        projectId,
      },
    });
    const forms = await prisma.form.findMany({
      where: {
        projectId,
        published: true,
      },
    });
    const stats = await prisma.form.aggregate({
      where: {
        projectId,
      },
      _sum: {
        visits: true,
        subCount: true,
      },
    });
    const visits = stats._sum.visits || 0;
    const subCount = stats._sum.subCount || 0;

    let submissionRate = 0;

    if (visits > 0) {
      submissionRate = (subCount / visits) * 100;
    }

    const bounceRate = 100 - submissionRate;

    const projectStats = {
      visits: visits,
      subCount: subCount,
      submissionRate: submissionRate,
      bounceRate: bounceRate,
      reports: reports.length,
      forms: forms.length,
    };
    return res.status(201).json(projectStats);
  } catch (err) {
    next(err);
  }
});

// Updates the role of an employee in a project
const editEmployeeRole = asyncHandler(async (req, res, next) => {
  try {
    const { orgId, projectId } = req.params;
    const { empId, role } = req.body;
    const oldValues = await prisma.employeeProjectAssociation.findFirst({
      where: {
        employeeId: empId,
        projectId: projectId,
      },
    });
    const updatedRole = await prisma.employeeProjectAssociation.update({
      where: {
        id: oldValues.id,
        employeeId: empId,
        projectId: projectId,
      },
      data: {
        role: role,
        updatedAt: new Date(),
      },
    });
    if (!updatedRole)
      throw new NotFoundError("Employee does not exist in this project");

    await createAuditLog(
      req.employeeId,
      req.ip.address || null,
      orgId,
      "update",
      "ProjectAssociation",
      JSON.stringify(oldValues),
      JSON.stringify(updatedRole),
      oldValues.id.toString()
    );
    res.status(201).json({
      message: "Role updated successfully",
      status: true,
      updatedRole,
    });
  } catch (err) {
    next(err);
  }
});

// Remove an employee from a project
const removeEmployee = asyncHandler(async (req, res, next) => {
  try {
    const { orgId, empId, projectId } = req.params;
    const projAssociation = await prisma.employeeProjectAssociation.findFirst({
      where: {
        employeeId: empId,
        projectId: projectId,
      },
      select: {
        id: true,
      },
    });
    const deletedAssociation = await prisma.employeeProjectAssociation.delete({
      where: {
        id: projAssociation.id,
      },
    });
    if (!deletedAssociation)
      throw new NotFoundError("Employee does not exist in this project");
    await createAuditLog(
      req.employeeId,
      req.ip.address || null,
      orgId,
      "delete",
      "ProjectAssociation",
      JSON.stringify(deletedAssociation),
      "",
      deletedAssociation.id.toString()
    );
    res.status(201).json({
      message: "Employee removed from project successfully",
      status: true,
      deletedAssociation,
    });
  } catch (err) {
    next(err);
  }
});

// Update a project
const updateProject = asyncHandler(async (req, res, next) => {
  try {
    const { orgId, projectId } = req.params;

    const oldValues = await prisma.project.findUnique({
      where: {
        id: projectId,
      },
      select: {
        image: true,
      },
    });

    let imageUrl = oldValues.image;

    if (req.file) {
      const { publicId } = getPublicIdFromUrl(logoUrl);
      imageUrl = await uploadFile(req.file, publicId);
    }

    const updatedProject = await prisma.project.update({
      where: {
        id: projectId,
      },
      data: {
        ...req.body,
        image: imageUrl || null,
      },
    });
    if (!updatedProject) throw new NotFoundError("Project not found");
    await createAuditLog(
      req.employeeId,
      req.ip.address || null,
      orgId,
      "update",
      "Project",
      JSON.stringify(oldValues),
      JSON.stringify(updatedProject),
      oldValues.id.toString()
    );
    res.status(201).json({
      message: "Project updated successfully",
      status: true,
      updatedProject,
    });
  } catch (err) {
    next(err);
  }
});

// Update project status
const updateProjectStatus = asyncHandler(async (req, res, next) => {
  try {
    const { orgId, projectId } = req.params;
    const { status, endDate } = req.body;
    const oldValues = await prisma.project.findUnique({
      where: {
        id: projectId,
      },
    });
    const updatedProject = await prisma.project.update({
      where: {
        id: projectId,
      },
      data: {
        status,
        endDate,
        isCompleted: true,
      },
    });
    if (!updatedProject) throw new NotFoundError("Project not found");
    await prisma.form.updateMany({
      where: {
        projectId,
      },
      data: {
        closed: true,
      },
    });
    await createAuditLog(
      req.employeeId,
      req.ip.address || null,
      orgId,
      "update",
      "Project",
      JSON.stringify(oldValues),
      JSON.stringify(updatedProject),
      oldValues.id.toString()
    );
    res.status(201).json({
      message: "Project updated successfully",
      status: true,
      updatedProject,
    });
  } catch (err) {
    next(err);
  }
});

// Exports a project data in json format
const exportProject = asyncHandler(async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const project = await prisma.project.findUnique({
      where: {
        id: projectId,
      },
      include: {
        creator: true,
        organization: true,
        reports: true,
        forms: {
          where: {
            published: true,
          },
        },
      },
    });
    if (!project) throw new NotFoundError("Project not found");
    const stats = await prisma.form.aggregate({
      where: {
        projectId,
      },
      _sum: {
        visits: true,
        subCount: true,
      },
    });
    const visits = stats._sum.visits || 0;
    const subCount = stats._sum.subCount || 0;

    let submissionRate = 0;
    let bounceRate = 0;

    if (visits > 0) {
      submissionRate = (subCount / visits) * 100;
      bounceRate = 100 - submissionRate;
    }

    const csvWriter = new createObjectCsvWriter({
      path: `${project.name}.csv`,
      header: [
        // Define the CSV header
        { id: "project_id", title: "Project Id" },
        { id: "organization", title: "Organization" },
        { id: "name", title: "Name" },
        { id: "creator", title: "Created By" },
        { id: "description", title: "Description" },
        { id: "expectedDuration", title: "Expected Duration" },
        { id: "status", title: "Status" },
        { id: "isCompleted", title: "Is Completed?" },
        { id: "createdAt", title: "Created At" },
        { id: "updatedAt", title: "Last Updated At" },
        { id: "startDate", title: "Start Date" },
        { id: "endDate", title: "End Date" },
        { id: "forms", title: "Published Forms" },
        { id: "formVisits", title: "Form Visits" },
        { id: "submissionCount", title: "Submission Count" },
        { id: "submissionRate", title: "Submission Rate %" },
        { id: "bounceRate", title: "Bounce Rate %" },
        { id: "reports", title: "Reports" },
      ],
    });

    const records = [
      {
        project_id: project.id,
        organization: project.organization?.name || project.organizationId,
        name: project.name,
        creator: project.creator?.fullName || project.creatorId,
        description: project.description,
        expectedDuration: project.expectedDuration,
        status: project.status,
        isCompleted: project.isCompleted ? "Yes" : "No",
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
        startDate: project.startDate,
        endDate: project.isCompleted ? project.endDate : "In Progress",
        forms: project.forms.length,
        formVisits: visits,
        submissionCount: subCount,
        submissionRate: submissionRate,
        bounceRate: bounceRate,
        reports: project.reports.length,
      },
    ];

    csvWriter
      .writeRecords(records)
      .then(() => {
        res.download(`${project.name}.csv`); // Send the CSV file as a response
      })
      .catch((error) => {
        throw new InternalServerError(error);
      });
  } catch (err) {
    next(err);
  }
});

// Delete a project
const deleteProject = asyncHandler(async (req, res, next) => {
  try {
    const { orgId, projectId } = req.params;
    const deletedProject = await prisma.project.delete({
      where: {
        id: projectId,
      },
    });
    if (!deletedProject) throw new NotFoundError("Project not found");
    await createAuditLog(
      req.employeeId,
      req.ip.address || null,
      orgId,
      "delete",
      "Project",
      JSON.stringify(deletedProject),
      "",
      deletedProject.id.toString()
    );
    res
      .status(201)
      .json({ message: "Project deleted", status: true, deletedProject });
  } catch (err) {
    next(err);
  }
});

// Search Project
const searchProject = asyncHandler(async (req, res) => {
  const { orgId } = req.params;
  const { query } = req.query;

  try {
    // Check if the organization exists
    const organization = await prisma.organization.findUnique({
      where: { id: orgId },
    });

    if (!organization) {
      return res.status(404).json({ error: "Organization not found" });
    }

    const project = await prisma.project.findFirst({
      where: {
        name: query,
      },
    });

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    res.status(200).json(project);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error });
  }
});

// Export endpoints
export {
  addEmployee,
  createProject,
  deleteProject,
  editEmployeeRole,
  exportProject,
  getAllEmployees,
  getEmployeeProjects,
  getOrgProject,
  getOrgProjects,
  getProjectEmployees,
  getProjectStats,
  removeEmployee,
  searchProject,
  updateProject,
  updateProjectStatus,
};
