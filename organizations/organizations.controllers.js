import { EmployeeRole, PrismaClient } from "@prisma/client";
import asyncHandler from "express-async-handler";
import ShortUniqueId from "short-unique-id";
import { addNewCustomer } from "../helpers/stripe.js";
import {
  getPublicIdFromUrl,
  updateFile,
} from "../services/cloudinaryService.js";
import client from "../services/redisClient.js";
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
  const cacheKey = `user_organizations:${id}`;
  try {
    // Check cache first
    const cachedData = await client.get(cacheKey);
    if (cachedData) {
      return res
        .status(200)
        .json({ isCached: true, organizations: JSON.parse(cachedData) });
    }

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

    // Cache the result
    await client.set(cacheKey, JSON.stringify(organizations), {
      EX: 3600, // Set an expiry for the cache, e.g., 1 hour
    });

    res.status(200).json({ isCached: false, organizations });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get an organization by ID
const getOrganizationById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const cacheKey = `organization:${id}`;
  try {
    // Check cache first
    const cachedData = await client.get(cacheKey);
    if (cachedData) {
      return res
        .status(200)
        .json({ isCached: true, organization: JSON.parse(cachedData) });
    }

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

    // Cache the result
    await client.set(cacheKey, JSON.stringify(organization), {
      EX: 3600, // Set an expiry for the cache, e.g., 1 hour
    });

    res.status(200).json({ isCached: false, organization });
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

    res.status(202).json({
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
      return res.status(404).json({
        message: `organization with ID ${id} not found.`,
        status: false,
      });
    }

    await prisma.organization.delete({
      where: { id },
    });

    res
      .status(204)
      .json({ message: `organization ${id} deleted`, status: true });
  } catch (error) {
    res.status(500).json({ message: error.message, status: false });
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
