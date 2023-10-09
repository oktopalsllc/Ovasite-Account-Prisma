import{
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
} from './project.routes';
import express from "express";

const projectRouter = express.Router();

projectRouter.post('/createproject', createProject);
projectRouter.post('/addemployee/:orgId', addEmployee);
projectRouter.get('/getprojects/:orgId', getOrgProjects);
projectRouter.get('/getemployeeprojects/:orgId', getEmployeeProjects);
projectRouter.get('/getprojectemployees/:orgId', getProjectEmployees);
projectRouter.put('/updateprojectrole', editEmployeeRole);
projectRouter.delete('/removeemployee', removeEmployee);
projectRouter.patch('/updateproject', updateProject);
projectRouter.get('exportdata', exportProject);
projectRouter.delete('/deleteproject', deleteProject);

export default projectRouter;