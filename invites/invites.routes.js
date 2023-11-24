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

const inviteRouter = express.Router();

inviteRouter.post(
  "/:orgId/generate-invite-link",
  verifyToken,
  getCurrentOrganization,
  getCurrentEmployee,
  generateInviteLink
);
inviteRouter.post("/join/:inviteToken", joinOrganization);
inviteRouter.post("/check-user-exists/:inviteToken", checkUserExists);

export default inviteRouter;
