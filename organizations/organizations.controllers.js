import pkg from "@prisma/client";
import asyncHandler from "express-async-handler";
import ShortUniqueId from "short-unique-id";
import { addNewCustomer } from "../helpers/stripe.js";
import {
  getPublicIdFromUrl,
  updateFile,
} from "../services/cloudinaryService.js";
const { PrismaClient, EmployeeRole } = pkg;

const prisma = new PrismaClient();

const { randomUUID } = new ShortUniqueId({ length: 10 });

// Create a new organization
const createOrganization = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const { id: userId, email } = req.user;
  const lowercaseEmail = email.toLowerCase();
  try {
    // Check if a user with the provided email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: lowercaseEmail },
    });

    if (!existingUser) {
      return res
        .status(400)
        .json({ error: `User with email ${lowercaseEmail} already exists.` });
    }

    // Check if an organization with the same name already exists
    const existingOrganization = await prisma.organization.findFirst({
      where: { name },
    });

    if (existingOrganization) {
      return res
        .status(400)
        .json({ error: `organization name ${name} already exists.` });
    }

    const stripeCustomer = await addNewCustomer(lowercaseEmail);

    // Create a new organization with the provided data
    const newOrganization = await prisma.organization.create({
      data: {
        name: name,
        inviteCode: randomUUID(),
        stripeCustomerId: stripeCustomer.id,
        userId,
      },
    });

    // Create a new employee associated with the user who created the organization
    const newEmployee = await prisma.employee.create({
      data: {
        email: lowercaseEmail,
        role: EmployeeRole.OWNER,
        user: { connect: { id: userId } },
        organization: { connect: { id: newOrganization.id } },
      },
    });

    res.status(201).json(newOrganization);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// Get all current user organizations
const getUserOrganizations = asyncHandler(async (req, res) => {
  const { email, id } = req.user;
  try {
    const organizations = await prisma.organization.findMany({
      where: {
        OR: [{ userId: id }, { employees: { some: { email } } }],
      },
      include: {
        employees: {
          select: {
            id: true,
          },
        },
      },
    });

    // Check if the user is not part of any organizations
    if (organizations.length === 0) {
      return res
        .status(200)
        .json({ message: "You're not a part of any organization" });
    }
    res.status(200).json(organizations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get an organization by ID
const getOrganizationById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const organization = await prisma.organization.findUnique({
      where: { id },
      include: {
        employees: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!organization) {
      res.status(404).json(`organization ${id} not found`);
    }

    res.status(200).json(organization);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update an organization by ID
const updateOrganization = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, address } = req.body;

  try {
    const existingOrganization = await prisma.organization.findUnique({
      where: { id },
      select: { logo: true },
    });

    if (!existingOrganization) {
      return res
        .status(404)
        .json({ error: `Organization with ID ${id} not found.` });
    }

    let logoUrl = existingOrganization.logo;
    if (req.file) {
      const { publicId } = getPublicIdFromUrl(logoUrl);
      logoUrl = await updateFile(req.file, publicId);
    }

    const updatedOrganization = await prisma.organization.update({
      where: { id },
      data: {
        name: name || existingOrganization.name,
        address: address || null,
        logo: logoUrl || existingOrganization.logo,
      },
    });

    res
      .status(202)
      .json({
        message: "Organization updated",
        status: true,
        updatedOrganization,
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// TODO: handle delete error correctly
// Delete an organization by ID
const deleteOrganization = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    // Check if the organization with the specified ID exists
    const existingOrganization = await prisma.organization.findUnique({
      where: { id },
    });

    if (!existingOrganization) {
      return res
        .status(404)
        .json({ error: `organization with ID ${id} not found.` });
    }

    await prisma.organization.delete({
      where: { id },
    });

    res.status(204).json(`organization ${id} deleted`);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const getOrganizationOwners = asyncHandler(async (req, res) => {
  try {
    const employees = await prisma.employee.findMany({
      where: {
        role: EmployeeRole.OWNER, // Filter by the role "OWNER"
      },
    });
    res.status(200).json(employees);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

export {
  createOrganization,
  deleteOrganization,
  getOrganizationById,
  getOrganizationOwners,
  getUserOrganizations,
  updateOrganization,
};
