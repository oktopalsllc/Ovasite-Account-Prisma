import express from "express";
import { generateInviteLink, joinOrganization } from "./invites.controllers.js";

const inviteRouter = express.Router();

inviteRouter.post("/:organizationId/generate-invite-link", generateInviteLink);
inviteRouter.post("/join/:inviteToken", joinOrganization);

export default inviteRouter;