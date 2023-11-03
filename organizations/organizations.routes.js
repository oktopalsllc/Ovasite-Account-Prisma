import express from "express";
import { verifyToken } from "../middleware/authenticate.js";
import {
  createOrganization,
  deleteOrganization,
  getAllOrganizations,
  getOrganizationById,
  getOrganizationOwners,
  updateOrganization,
} from "./organizations.controllers.js";
const organizationsRouter = express.Router({ mergeParams: true });

organizationsRouter.use("/", verifyToken);

organizationsRouter.post("/", createOrganization);
organizationsRouter.get("/", getAllOrganizations);
organizationsRouter.get("/org-owners", getOrganizationOwners);
organizationsRouter.get("/:id", getOrganizationById);
organizationsRouter.patch("/:id", updateOrganization);
organizationsRouter.delete("/:id", deleteOrganization);

export default organizationsRouter;
