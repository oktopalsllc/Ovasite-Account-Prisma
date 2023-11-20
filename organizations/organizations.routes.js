import express from "express";
import { verifyToken } from "../middleware/authenticate.js";
import upload from "../middleware/multerConfig.js";
import {
  createOrganization,
  deleteOrganization,
  getOrganizationById,
  getOrganizationOwners,
  getUserOrganizations,
  updateOrganization,
} from "./organizations.controllers.js";
const organizationsRouter = express.Router({ mergeParams: true });

organizationsRouter.use("/", verifyToken);

organizationsRouter.post("/", createOrganization);
organizationsRouter.get("/", getUserOrganizations);
organizationsRouter.get("/owners", getOrganizationOwners);
organizationsRouter.get("/:id", getOrganizationById);
organizationsRouter.patch("/:id", upload.single("logo"), updateOrganization);
organizationsRouter.delete("/:id", deleteOrganization);

export default organizationsRouter;
