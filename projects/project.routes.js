import{
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
} from './project.controller.js';
import { 
  checkOrganizationExists 
} from '../organizations/organizations.middleware.js';
import {
    verifyAdmin,
    verifyUser
} from "../middleware/authenticate.js";
import express from "express";

const projectRouter = express.Router({ mergeParams: true });

projectRouter.use('/:orgId', verifyUser);
projectRouter.use('/:orgId', checkOrganizationExists);

projectRouter.post('/:orgId/create/project', createProject);
projectRouter.post('/:orgId/adduser/:projectId', addEmployee);
projectRouter.get('/:orgId/project/:projectId', getOrgProject);
projectRouter.get('/:orgId/projects', getOrgProjects);
projectRouter.get('/:orgId/userprojects/:empId', getEmployeeProjects);
projectRouter.get('/:orgId/projectusers/:projectId', getProjectEmployees);
projectRouter.put('/:orgId/updateprojectrole/:projectId', editEmployeeRole);
projectRouter.delete('/:orgId/:projectId/removeemployee/:empId', removeEmployee);
projectRouter.patch('/:orgId/update/project/:projectId', updateProject);
projectRouter.get('/:orgId/export/project/:projectId', exportProject);
projectRouter.delete('/:orgId/delete/project/:projectId', deleteProject);

export default projectRouter;