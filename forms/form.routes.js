import express from "express";
import { verifyUser } from "../middleware/authenticate.js";
import { checkOrganizationExists } from "../organizations/organizations.middleware.js";
import {
  createForm,
  deleteForm,
  getForm,
  getForms,
  getFormsByEmployee,
  updateForm,
} from "./form.controller.js";

const formRouter = express.Router({ mergeParams: true });

formRouter.use("/:orgId", verifyUser);
formRouter.use("/:orgId", checkOrganizationExists);

formRouter.post("/:orgId/form/create", createForm);
formRouter.get("/:orgId/form/:formId", getForm);
formRouter.get("/:orgId/forms/:projectId", getForms);
formRouter.get("/:orgId/userforms/:creatorId/:projectId", getFormsByEmployee);
formRouter.patch("/:orgId/form/update/:formId", updateForm);
formRouter.delete("/:orgId/form/delete/:formId", deleteForm);

export default formRouter;
