import express from "express";
import {
  getAllMembersByOrganization,
  getMemberByIdByOrganization,
  updateMemberByOrganization,
  deleteMemberByOrganization,
} from "./members.controllers.js";

const memberRouter = express.Router();

// Routes for managing members within an organization
memberRouter.get("/:organizationId/members", getAllMembersByOrganization);
memberRouter.get(
  "/:organizationId/members/:memberId",
  getMemberByIdByOrganization
);
memberRouter.patch(
  "/:organizationId/members/:memberId",
  updateMemberByOrganization
);
memberRouter.delete(
  "/:organizationId/members/:memberId",
  deleteMemberByOrganization
);

export default memberRouter;
