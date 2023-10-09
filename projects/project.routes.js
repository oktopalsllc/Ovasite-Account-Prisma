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
import express from "express";

const projectRouter = express.Router();

projectRouter.post('/createproject', createProject);
projectRouter.post('/addemployee/:orgId', addEmployee);
projectRouter.get('/project/:orgId/:projectId', getOrgProject);
projectRouter.get('/projects/:orgId', getOrgProjects);
projectRouter.get('/employeeprojects/:orgId', getEmployeeProjects);
projectRouter.get('/projectemployees/:orgId', getProjectEmployees);
projectRouter.put('/updateprojectrole', editEmployeeRole);
projectRouter.delete('/removeemployee', removeEmployee);
projectRouter.patch('/update/:projectId', updateProject);
projectRouter.get('/export/:projectId', exportProject);
projectRouter.delete('/delete/:projectId', deleteProject);

export default projectRouter;