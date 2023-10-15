import {
    createForm,
    getForm,
    getForms,
    getFormByEmployee,
    getFormsByEmployee,
    updateForm,
    deleteForm
} from './form.controller.js';
import express from "express";
import { 
    checkOrganizationExists 
} from '../organizations/organizations.middleware.js';
import {
    verifyAdmin,
    verifyUser
} from "../middleware/authenticate.js";

const formRouter = express.Router({ mergeParams: true });

formRouter.use('/:orgId', verifyUser);
formRouter.use('/:orgId', checkOrganizationExists);

formRouter.post('/:orgId/form/create', createForm);
formRouter.get('/:orgId/form/:formId', getForm);
formRouter.get('/:orgId/forms/:projectId', getForms);
formRouter.get('/:orgId/userform/:creatorId/:formId', getFormByEmployee);
formRouter.get('/:orgId/userforms/:creatorId/:projectId', getFormsByEmployee);
formRouter.patch('/:orgId/update/form/:formId', updateForm);
formRouter.delete('/:orgId/delete/form/:formId', deleteForm);

export default formRouter;