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
} from './project.controller';
import { checkOrganizationExists } from '../organizations/organizations.middleware';
import express from "express";

const projectRouter = express.Router({ mergeParams: true });

projectRouter.use(':/orgId', checkOrganizationExists);

projectRouter.post('/:orgId/create', createProject);
projectRouter.post('/:orgId/addemployee', addEmployee);
projectRouter.get('/:orgId/project/:projectId', getOrgProject);
projectRouter.get('/:orgId/getprojects', getOrgProjects);
projectRouter.get('/:orgId/:empId/employeeprojects', getEmployeeProjects);
projectRouter.get('/:orgId/:projectId/projectemployees', getProjectEmployees);
projectRouter.put('/:orgId/updateprojectrole', editEmployeeRole);
projectRouter.delete('/:orgId/removeemployee', removeEmployee);
projectRouter.patch('/:orgId/update/:projectId', updateProject);
projectRouter.get('/:orgId/export/:projectId', exportProject);
projectRouter.delete('/:orgId/delete/:projectId', deleteProject);

export default projectRouter;