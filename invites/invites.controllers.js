import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import asyncHandler from "express-async-handler";
import { v4 as uuidv4 } from "uuid";
import sendMail from "../services/sendMail.js";
import inviteTemplate from "../templates/inviteTemplate.js";

const prisma = new PrismaClient();

const url = process.env.BASE_URL;

const generateInviteLink = asyncHandler(async (req, res) => {
  let { email, role } = req.body;
  const { orgId } = req.params;
  email = email.toLowerCase();

  try {
    // Check if the organization exists
    const organization = await prisma.organization.findUnique({
      where: { id: orgId },
    });

    if (!organization) {
      return res.status(404).json({ error: "organization not found" });
    }

    // Check if the email already exists in the organization
    const existingEmployee = await prisma.employee.findFirst({
      where: { email, organizationId: orgId },
    });

    if (existingEmployee) {
      return res
        .status(400)
        .json({ error: "Email already exists in the organization" });
    }

    // Generate unique token
    const inviteToken = uuidv4();

    // Set expiration date
    const expireDate = new Date();
    expireDate.setDate(expireDate.getDate() + 7);

    // Save the invite link with the organization relationship
    await prisma.invite.create({
      data: {
        token: inviteToken,
        email,
        role,
        expirationDate: expireDate,
        organization: { connect: { id: orgId } },
        employee: { connect: { id: req.employeeId } },
      },
    });

    // Send an email with the invite link
    const mailOptions = {
      from: "Ovasite <no-reply@oktopals.com>",
      to: email,
      subject: `${organization.name} invited you to Ovasite`,
      html: inviteTemplate(url, inviteToken, organization.name),
    };

    // Sending the invitation email
    const data = await sendMail(mailOptions);

    res.status(201).json({ inviteToken, data, msg: "Invitation sent" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

const joinOrganization = asyncHandler(async (req, res) => {
  const { inviteToken } = req.params;

  try {
    // Find the invite link in the database using Prisma
    const invite = await prisma.invite.findFirst({
      where: { token: inviteToken },
    });

    if (!invite || invite.expirationDate < new Date()) {
      return res
        .status(404)
        .json({ error: "Invite link not found or expired" });
    }

    const organization = await prisma.organization.findUnique({
      where: { id: invite.organizationId },
    });

    if (!organization) {
      return res.status(404).json({ error: "Organization not found" });
    }

    // Extract email from invite token (assuming email is part of invite record)
    const invitedEmail = invite.email.toLowerCase();

    let existingUser = await prisma.user.findUnique({
      where: { email: invitedEmail },
    });

    if (existingUser) {
      // Create an employee record for the existing user
      const newEmployee = await prisma.employee.create({
        data: {
          fullName: existingUser.fullName, // Assuming fullName is part of the user record
          email: invitedEmail,
          organization: { connect: { id: organization.id } },
          role: invite.role,
          user: { connect: { id: existingUser.id } },
        },
      });
      const toDeleteInvite = await prisma.invite.findFirst({
        where: { token: inviteToken },
      });
      await prisma.invite.delete({
        where: { id: toDeleteInvite.id, token: inviteToken },
      });
      return res.status(200).json(newEmployee);
    }

    // Below is the logic for new users
    let { fullName, email, password } = req.body;
    if (!fullName || !password) {
      return res
        .status(400)
        .json({ error: "Full name and password are required for new users" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        password: hashedPassword,
      },
    });

    const newEmployee = await prisma.employee.create({
      data: {
        fullName,
        email: email.toLowerCase(),
        organization: { connect: { id: organization.id } },
        role: invite.role,
        user: { connect: { id: newUser.id } },
      },
    });

    const toDeleteInvite = await prisma.invite.findFirst({
      where: { token: inviteToken },
    });

    await prisma.invite.delete({
      where: {
        id: toDeleteInvite.id,
        token: inviteToken,
      },
    });
    res.status(200).json(newEmployee);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

const checkUserExists = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const { inviteToken } = req.params;

  const invite = await prisma.invite.findFirst({
    where: { token: inviteToken },
  });

  if (!invite) {
    return res.status(404).json({ error: "Invalid invite token" });
  }

  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });

  res.status(200).json({ userExists: !!user });
});

export { checkUserExists, generateInviteLink, joinOrganization };
