import {
    createForm,
    getForm,
    getForms,
    getFormByEmployee,
    getFormsByEmployee,
    updateForm,
    deleteForm
} from './form.controller';
import express from "express";

const formRouter = express.Router();

formRouter.post('/create', createForm);
formRouter.get('/form/:formId', getForm);
formRouter.get('/getforms/:projectId', getForms);
formRouter.get('/employeeform/:creatorId/:formId', getFormByEmployee);
formRouter.get('/employeeforms/:creatorId', getFormsByEmployee);
formRouter.patch('/update/:formId', updateForm);
formRouter.delete('/delete/:formId', deleteForm);

export default formRouter;