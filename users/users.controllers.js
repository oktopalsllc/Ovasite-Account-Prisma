import { PrismaClient } from "@prisma/client";
import asyncHandler from "express-async-handler";

const prisma = new PrismaClient();

// TODO: update deleteUser to remove user from all the organization they are part of as well as delete the user
// TODO: before the user is deleted, remove the user from all the teams they are a part of
// TODO: users account should be permanently deleted after 30 days of clicking delete
// TODO: user can undo their account deletion
// TODO: the deletion can be a cronJob that will complete after 30days of requesting deletion
// TODO: create updateUser endpoint to change
// TODO: get user by email

const getSingleUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: { id: id },
    });

    if (!user) {
      return res
        .status(404)
        .json({ message: `User with the specified ID ${id} was not found` });
    }
    const userInfo = {
      id: user.id,
      email: user.email,
      role: user.role,
      stripeCustomerId: user.stripeCustomerId,
      stripeSubscriptionId: user.stripeSubscriptionId,
      stripePriceId: user.stripePriceId,
      stripeCurrentPeriodEnd: user.stripeCurrentPeriodEnd,
      createdAt: user.createdAt
    }
    res.status(200).json(userInfo);
  } catch (err) {
    throw new Error(err);
  }
});

const getUserByEmail = asyncHandler(async (req, res) => {
  const { email } = req.query;
  console.log(req.query);
  console.log("email", email);
  try {
    const user = await prisma.user.findFirst({
      where: { email: email },
    });

    if (!user) {
      return res
        .status(404)
        .json({ message: `User with the specified ID ${email} was not found` });
    }
    res.status(200).json(user);
  } catch (err) {
    throw new Error(err);
  }
});

// Get organizations where user is the owner
const getUserOrgs = asyncHandler(async (req, res) => {
  try {
    const userId = req.userId;
    const employees = await prisma.employee.findMany({
      where: {
        userId: userId,
        role: employeeRole.OWNER
      },
      include: {
        organization: true
      }
    });    
    const organizations = employees.map(emp => emp.organization);
    const count = organizations.length;
    res.json({userOrgs: organizations, count: count});
  }
  catch (err) {
    console.error(err);
    throw new Error(err);
  }
});

// Get employees of organizations 
// where user is the owner
const getUserOrgsEmps = asyncHandler(async (req, res) => {
  try {
    const userId = req.userId;
    const employees = await prisma.employee.findMany({
      where: {
        userId: userId,
        role: 'OWNER'
      },
      include: {
        organization: {
          include: {
            employees: true
          }
        }
      }
    });
    const orgsEmployees = employees.map(emp => ({ organization: emp.organization, employees: emp.organization.employees }));
    const count = orgsEmployees.reduce((total, org) => total + org.employees.length, 0);
    res.json({userEmps:orgsEmployees, count: count});
  }
  catch (err) {
    console.error(err);
    throw new Error(err);
  }
});

// Get projects by organizations where user is the owner
const getUserOrgsProjects = asyncHandler(async (req, res) => {
  try {
    const userId = req.userId;
    const employees = await prisma.employee.findMany({
      where: {
        userId: userId,
        role: 'OWNER'
      },
      include: {
        organization: {
          include: {
            projects: true
          }
        }
      }
    });
    const orgsProjects = employees.map(emp => ({ organization: emp.organization, projects: emp.organization.projects }));
    const count = orgsProjects.reduce((total, org) => total + org.projects.length, 0);
    res.json({orgsProjects: orgsProjects, count: count});
  }
  catch (err) {
    console.error(err);
    throw new Error(err);
  }
});

// Get forms of projects by organizations 
// where user is the owner
const getUserOrgsForms = asyncHandler(async (req, res) => {
  try {
    const userId = req.userId;
    const employees = await prisma.employee.findMany({
      where: {
        userId: userId,
        role: 'OWNER'
      },
      include: {
        organization: {
          include: {
            projects: {
              include: {
                forms: true
              }
            }
          }
        }
      }
    });
    const orgsForms = employees.map(emp => ({
      organization: emp.organization,
      projects: emp.organization.projects.map(proj => ({ project: proj, forms: proj.forms }))
    }));
    const count = orgsForms.reduce((total, org) => total + org.projects.reduce((total, proj) => total + proj.forms.length, 0), 0);
    res.json({orgsForms: orgsForms, count: count});
  }
  catch (err) {
    console.error(err);
    throw new Error(err);
  }
});

// Get submissions of projects by organizations 
// where user is the owner
const getUserOrgsSubmissions = asyncHandler(async (req, res) => {
  try {
    const userId = req.userId;
    const employees = await prisma.employee.findMany({
      where: {
        userId: userId,
        role: 'OWNER'
      },
      include: {
        organization: {
          include: {
            projects: {
              include: {
                submissions: true
              }
            }
          }
        }
      }
    });
    const orgsSubmissions = employees.map(emp => ({
      organization: emp.organization,
      projects: emp.organization.projects.map(proj => ({ project: proj, submissions: proj.submissions }))
    }));
    const count = orgsSubmissions.reduce((total, org) => total + org.projects.reduce((total, proj) => total + proj.submissions.length, 0), 0);
    res.json({orgsSubmissions: orgsSubmissions, count: count});
  }
  catch (err) {
    console.error(err);
    throw new Error(err);
  }
});

// Get reports of projects by organizations 
// where user is the owner
const getUserOrgsReports = asyncHandler(async (req, res) => {
  try {
    const userId = req.userId;
    const employees = await prisma.employee.findMany({
      where: {
        userId: userId,
        role: 'OWNER'
      },
      include: {
        organization: {
          include: {
            projects: {
              include: {
                reports: true
              }
            }
          }
        }
      }
    });
    const orgsReports = employees.map(emp => ({
      organization: emp.organization,
      projects: emp.organization.projects.map(proj => ({ project: proj, reports: proj.reports }))
    }));
    const count = orgsReports.reduce((total, org) => total + org.projects.reduce((total, proj) => total + proj.reports.length, 0), 0);
    res.json({orgsReports: orgsReports, count: count});
  }
  catch (err) {
    console.error(err);
    throw new Error(err);
  }
});

const getAllUsers = asyncHandler(async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    throw new Error(err);
  }
});

const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const user = await prisma.user.findFirst({
      where: { id: id },
    });

    if (!user) {
      return res
        .status(404)
        .json({ message: `User with the specified ID ${id} was not found` });
    }
    const deletedUser = await prisma.user.delete({
      where: {
        id,
      },
    });

    if (!deletedUser) {
      return res
        .status(404)
        .json({ message: `User with the specified ID ${id} was not found` });
    }

    return res.status(204).json("User has been deleted.");
  } catch (err) {
    throw new Error(err);
  }
});

export { 
  deleteUser, 
  getAllUsers, 
  getSingleUser, 
  getUserByEmail,
  getUserOrgs,
  getUserOrgsEmps,
  getUserOrgsProjects,
  getUserOrgsForms,
  getUserOrgsSubmissions,
  getUserOrgsReports 
};
