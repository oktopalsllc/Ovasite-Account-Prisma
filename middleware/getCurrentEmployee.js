import pkg from '@prisma/client';
const { PrismaClient } = pkg;
import asyncHandler from "express-async-handler";

const prisma = new PrismaClient();

export const getCurrentEmployee = asyncHandler(async (req, res, next) => {
  const { id: userId } = req.user;
  const { orgId } = req.params;

  try {
    // Query the database to check if the user has an associated employee within the organization
    const employee = await prisma.employee.findFirst({
      where: {
        userId,
        organizationId: orgId, // You may access the organization ID from the request
      },
    });
    if (!employee) {
      return res
        .status(403)
        .json({ error: "User is not an employee in this organization" });
    }
    // Attach the employee object to the request for further use if needed
    req.employeeId = employee.id;

    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});
