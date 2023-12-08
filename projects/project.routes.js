import express from "express";
import { getCurrentEmployee } from "../middleware/getCurrentEmployee.js";
import { getCurrentOrganization } from "../middleware/getCurrentOrganization.js";
import {
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
} from "./project.controller.js";

const projectRouter = express.Router({ mergeParams: true });

projectRouter.use("/:orgId", getCurrentOrganization, getCurrentEmployee);

projectRouter.post("/:orgId/project/create", createProject);
projectRouter.post("/:orgId/project/search", searchProject);
projectRouter.post("/:orgId/project/adduser/:projectId", addEmployee);
projectRouter.get("/:orgId/project/:projectId", getOrgProject);
projectRouter.get("/:orgId/projects", getOrgProjects);
projectRouter.get("/:orgId/project/stats/:projectId", getProjectStats);
projectRouter.get("/:orgId/userprojects/:empId", getEmployeeProjects);
projectRouter.get("/:orgId/projectemployees/:projectId", getAllEmployees);
projectRouter.get("/:orgId/projectusers/:projectId", getProjectEmployees);
projectRouter.patch("/:orgId/updateprojectrole/:projectId", editEmployeeRole);
projectRouter.delete(
  "/:orgId/:projectId/removeemployee/:empId",
  removeEmployee
);
projectRouter.patch("/:orgId/project/update/:projectId", updateProject);
projectRouter.patch("/:orgId/project/status/:projectId", updateProjectStatus);
projectRouter.get("/:orgId/project/export/:projectId", exportProject);
projectRouter.delete("/:orgId/project/delete/:projectId", deleteProject);

export default projectRouter;
