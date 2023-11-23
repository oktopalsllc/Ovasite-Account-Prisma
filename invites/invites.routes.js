import express from "express";
import { verifyToken } from "../middleware/authenticate.js";
import {
  getCurrentEmployee,
  getCurrentOrganization,
} from "../middleware/index.js";
import {
  checkUserExists,
  generateInviteLink,
  joinOrganization,
} from "./invites.controllers.js";

const inviteRouter = express.Router({ mergeParams: true });

inviteRouter.use("/:orgId", verifyToken);

inviteRouter.post(
  "/:orgId/generate-invite-link",
  getCurrentOrganization,
  getCurrentEmployee,
  generateInviteLink
);
inviteRouter.post("/join/:inviteToken", joinOrganization);
inviteRouter.post("/check-user-exists", checkUserExists);

export default inviteRouter;
