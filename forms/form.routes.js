import express from "express";
import { getCurrentEmployee } from "../middleware/getCurrentEmployee.js";
import { checkOrganizationExists } from "../organizations/organizations.middleware.js";
import {
  createForm,
  deleteForm,
  getForm,
  getFormWithSubmissions,
  getFormData,
  getForms,
  getFormsByEmployee,
  publishForm,
  updateForm,
  updateFormData
} from "./form.controller.js";

const formRouter = express.Router({ mergeParams: true });

formRouter.use("/:orgId", checkOrganizationExists, getCurrentEmployee);

formRouter.post("/:orgId/form/create", createForm);
formRouter.get("/:orgId/form/:formId", getForm);
formRouter.get("/:orgId/form/data/:formId", getFormData);
formRouter.get("/:orgId/form/submissions/:formId", getFormWithSubmissions);
formRouter.get("/:orgId/forms/:projectId", getForms);
formRouter.get("/:orgId/userforms/:creatorId/:projectId", getFormsByEmployee);
formRouter.patch("/:orgId/form/publish/:projectId", publishForm);
formRouter.patch("/:orgId/form/update/:formId", updateForm);
formRouter.patch("/:orgId/form/update/data/:formId", updateFormData);
formRouter.delete("/:orgId/form/delete/:formId", deleteForm);

export default formRouter;
