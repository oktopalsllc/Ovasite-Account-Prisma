import Member from "../members/members.models.js";
import Organization from "./organization.models.js";
import asyncHandler from "express-async-handler";

// Create a new organizations
const createOrganization = asyncHandler(async (req, res) => {
  const { createdBy } = req.user.id;
  const { name } = req.body;
  try {

      // Check if an organization with the same name already exists
  const existingOrganization = await Organization.findOne({ name });

  if (existingOrganization) {
    return res
      .status(400)
      .json({ error: `Organization name ${name} already exists.` });
  }
  
    // Create a new organization with the provided data
    const newOrganization = await Organization.create({
      ...req.body,
      createdBy: createdBy,
    });

    // Create a new member associated with the user who created the organization
    const newMember = await Member.create({
      organization: newOrganization._id,
      fullName: req.user.fullName,
      email: req.user.email,
      password: req.user.password,
      role: "Owner",
    });

    // add the newly created member to the the organization's member array
    newOrganization.members.push(newMember);
    await newOrganization.save();

    res.status(201).json(newOrganization);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Get all organizations
const getAllOrganizations = asyncHandler(async (req, res) => {
  try {
    const organizations = await Organization.find();
    res.status(200).json(organizations);
  } catch (error) {
    throw new Error(error);
  }
});

// Get an organization by ID
const getOrganizationById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const organization = await Organization.findById(id);
    if (!organization) {
      res.status(404).json(`Organization ${id} not found`);
    }
    res.status(200).json(organization);
  } catch (error) {
    throw new Error(error);
  }
});

// Update an organization by ID
const updateOrganization = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const organization = await Organization.findById(id);
    if (!organization) {
      res.status(404).json(`Organization ${id} not found`);
    }
    const updatedOrganization = await Organization.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );
    res.status(202).json(updatedOrganization);
  } catch (error) {
    throw new Error(error);
  }
});

// Delete an organization by ID
const deleteOrganization = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const organization = await Organization.findById(id);
    if (!organization) {
      res.status(404).json(`Organization ${id} not found`);
    }
    await Organization.findByIdAndDelete(id);
    res.status(204).json(`Organization ${id} deleted`);
  } catch (error) {
    throw new Error(error);
  }
});
export {
  createOrganization,
  getAllOrganizations,
  getOrganizationById,
  updateOrganization,
  deleteOrganization,
};
