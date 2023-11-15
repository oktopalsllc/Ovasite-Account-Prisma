import{
  createProject,
  addEmployee,
  getOrgProject,
  getOrgProjects,
  getEmployeeProjects,
  getProjectEmployees,
  getAllEmployees,
  getProjectStats,
  editEmployeeRole,
  removeEmployee,
  updateProject,
  exportProject,
  deleteProject
} from './project.controller.js';
import { getCurrentEmployee } from "../middleware/getCurrentEmployee.js";
import { 
checkOrganizationExists 
} from '../organizations/organizations.middleware.js';
import {

verifyUser
} from "../middleware/authenticate.js";
import express from "express";

const projectRouter = express.Router({ mergeParams: true });

projectRouter.use('/:orgId', checkOrganizationExists, getCurrentEmployee);

projectRouter.post('/:orgId/project/create', createProject);
projectRouter.post('/:orgId/project/adduser/:projectId', addEmployee);
projectRouter.get('/:orgId/project/:projectId', getOrgProject);
projectRouter.get('/:orgId/projects', getOrgProjects);
projectRouter.get('/:orgId/project/stats/:projectId', getProjectStats);
projectRouter.get('/:orgId/userprojects/:empId', getEmployeeProjects);
projectRouter.get('/:orgId/projectemployees/:projectId', getAllEmployees);
projectRouter.get('/:orgId/projectusers/:projectId', getProjectEmployees);
projectRouter.patch('/:orgId/updateprojectrole/:projectId', editEmployeeRole);
projectRouter.delete('/:orgId/:projectId/removeemployee/:empId', removeEmployee);
projectRouter.patch('/:orgId/project/update/:projectId', updateProject);
projectRouter.get('/:orgId/project/export/:projectId', exportProject);
projectRouter.delete('/:orgId/project/delete/:projectId', deleteProject);

export default projectRouter;