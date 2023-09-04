import asyncHandler from "express-async-handler";
import { v4 as uuidv4 } from "uuid";
import Invite from "./invites.models.js";
import Member from "../members/members.models.js";
import Organization from "../organizations/organizations.models.js";
import bcrypt from "bcrypt";
import sendMail from "../services/sendMail.js";

import dotenv from "dotenv";
dotenv.config();
import { Resend } from "resend";

console.log("process.env.RESEND", process.env.RESEND);
const resend = new Resend(process.env.RESEND);

const url = "http://localhost/api/v1";

const generateInviteLink = asyncHandler(async (req, res) => {
  const { organizationId, email } = req.body;

  try {
    // Check if the organization exists
    const organization = await Organization.findById(organizationId);

    if (!organization) {
      return res.status(404).json({ error: "Organization not found" });
    }

    // Check if the email already exists in the organization
    const existingMember = await Member.findOne({
      email,
      organization: organizationId,
    });

    if (existingMember) {
      return res
        .status(400)
        .json({ error: "Email already exists in the organization" });
    }

    // generate unique token
    const inviteToken = uuidv4();

    // set expiration date
    const expireDate = new Date();
    expireDate.setDate(expireDate.getDate() + 7);

    // save the invite link
    const invite = new Invite({
      token: inviteToken,
      email: email,
      organization: organizationId,
      expireDate,
    });
    await invite.save();

    // Send an email with the invite link
    const mailOptions = {
      from: "OvaSite <onboarding@resend.dev>",
      to: email,
      subject: "Invitation to Join Organization",
      html: `
          <div class="container" style="max-width: 90%; margin: auto; padding-top: 20px">
            <h2>You have been invited to join an organization.</h2>
            <p>Click the following link to accept the invitation:</p>
            <a href="${url}/join/${inviteToken}">Accept Invitation</a>
          </div>
        `,
    };
    // sending the invitation
    const data = await sendMail(mailOptions);

    res.status(201).json({ inviteToken, data });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

const joinOrganization = asyncHandler(async (req, res) => {
  const { inviteToken } = req.params;
  const { fullName, email, password } = req.body;

  try {
    // Find the invite link in the database
    const invite = await Invite.findOne({ token: inviteToken });

    if (!invite || invite.expirationDate < new Date()) {
      return res
        .status(404)
        .json({ error: "Invite link not found or expired" });
    }

    // Check if the provided email matches the one associated with the invite link
    if (email !== invite.email) {
      return res.status(400).json({ error: "Invalid email address" });
    }

    // check if the organization exists
    const organization = await Organization.findById(invite.organization);

    if (!organization) {
      return res.status(404).json({ error: "Organization not found" });
    }

    // hash the users password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create a new member record
    const newMember = new Member({
      fullName,
      email,
      password: hashedPassword,
      organization: organization._id,
      role: "Member",
    });

    // Save the new member record to the database
    await newMember.save();

    // Add the new member to the organization's member array
    organization.members.push(newMember._id);
    await organization.save();

    // Delete the invite link as it has been used
    await invite.deleteOne();

    // Send a confirmation email to the member
    const mailOptions = {
      from: "OvaSite <onboarding@resend.dev>",
      to: email,
      subject: `Welcome to ${organization.name}!`,
      html: `
              <div class="container" style="max-width: 90%; margin: auto; padding-top: 20px">
            <h2> Welcome ${newMember.fullName} </h2>
            <p>We are glad to have you join our organization</p>
              </div>
            `,
    };

    const data = await sendMail(mailOptions);
    res.status(200).json({ user: newMember, data: data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export { generateInviteLink, joinOrganization };
