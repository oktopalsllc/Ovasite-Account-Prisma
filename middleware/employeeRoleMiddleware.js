import pkg from "@prisma/client";
import asyncHandler from "express-async-handler";
const { PrismaClient, EmployeeRole } = pkg;

const prisma = new PrismaClient();

// Generic role-based middleware function
function employeeRoleBasedMiddleware(allowedRoles) {
  return asyncHandler(async (req, res, next) => {
    const { id: userId } = req.user;
    const { orgId: organizationId } = req.params;

    try {
      // Query the database to check if the user has an associated employee within the organization
      const employee = await prisma.employee.findFirst({
        where: {
          userId,
          organizationId,
        },
      });

      if (!employee || !allowedRoles.includes(employee.role)) {
        return res.status(403).json({
          error: "User does not have the required role in this organization",
        });
      }

      // Attach the employee object to the request for further use if needed
      req.employeeId = employee.id;
      next();
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
}

// Specific role-based middleware functions
const memberMiddleware = employeeRoleBasedMiddleware([EmployeeRole.MEMBER]);
const adminMiddleware = employeeRoleBasedMiddleware([EmployeeRole.ADMIN]);
const ownerMiddleware = employeeRoleBasedMiddleware([EmployeeRole.OWNER]);
const guestMiddleware = employeeRoleBasedMiddleware([EmployeeRole.GUEST]);

// Middleware for Member or Admin roles
const memberAndAdminMiddleware = employeeRoleBasedMiddleware([
  EmployeeRole.MEMBER,
  EmployeeRole.ADMIN,
]);

// Middleware that includes all roles (MEMBER, ADMIN, OWNER)
const allRolesMiddleware = employeeRoleBasedMiddleware([
  EmployeeRole.MEMBER,
  EmployeeRole.ADMIN,
  EmployeeRole.OWNER,
]);

export {
  adminMiddleware,
  allRolesMiddleware,
  guestMiddleware,
  memberAndAdminMiddleware,
  memberMiddleware,
  ownerMiddleware,
};
