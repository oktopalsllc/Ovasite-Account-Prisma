import asyncHandler from "express-async-handler";
import Member from "./members.models.js";
import Organization from "../organizations/organizations.models.js";
import Team from "../teams/teams.models.js";

// Get all members by organization
const getAllMembersByOrganization = asyncHandler(async (req, res) => {
  const { organizationId } = req.params;
  try {
    const members = await Member.find({ organization: organizationId });

    const organization = await Organization.findById(organizationId);
    if (!organization) {
      return res
        .status(404)
        .json({ error: `Organization ${organizationId} not found` });
    }

    res.status(200).json(members);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get member by ID by organization
const getMemberByIdByOrganization = asyncHandler(async (req, res) => {
  const { organizationId, memberId } = req.params;
  try {
    const organization = await Organization.findById(organizationId);
    if (!organization) {
      return res
        .status(404)
        .json({ error: `Organization ${organizationId} not found` });
    }

    const member = await Member.findOne({
      _id: memberId,
      organization: organizationId,
    });
    if (!member) {
      return res.status(404).json({
        message: `Member ${memberId} not found in the organization`,
      });
    }

    if (!organizationId) {
      return res.status(404).json({ error: "Organization not found" });
    }

    res.status(200).json(member);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update member by ID by organization
const updateMemberByOrganization = asyncHandler(async (req, res) => {
  const { organizationId, memberId } = req.params;
  try {
    const organization = await Organization.findById(organizationId);
    if (!organization) {
      return res
        .status(404)
        .json({ error: `Organization ${organizationId} not found` });
    }

    const member = await Member.findOneAndUpdate(
      { _id: memberId, organization: organizationId },
      req.body,
      { new: true }
    );
    if (!member) {
      return res.status(404).json({
        message: `Member ${memberId} not found in the organization`,
      });
    }
    res.status(200).json(member);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete member by ID by organization
const deleteMemberByOrganization = asyncHandler(async (req, res) => {
  const { organizationId, memberId } = req.params;
  try {
    const organization = await Organization.findById(organizationId);
    if (!organization) {
      return res
        .status(404)
        .json({ error: `Organization ${organizationId} not found` });
    }

    const member = await Member.findOneAndDelete({
      _id: memberId,
      organization: organizationId,
    });
    if (!member) {
      return res.status(404).json({
        message: `Member ${memberId} not found in the organization`,
      });
    }
    res
      .status(204)
      .json({ message: `Member ${memberId} deleted successfully.` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export {
  getAllMembersByOrganization,
  getMemberByIdByOrganization,
  updateMemberByOrganization,
  deleteMemberByOrganization,
};
