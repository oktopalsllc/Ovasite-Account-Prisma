import pkg from '@prisma/client';
const { PrismaClient } = pkg;

const prisma = new PrismaClient();

export const getCurrentOrganization = async (req, res, next) => {
  const { orgId } = req.params;
  try {
    const organization = await prisma.organization.findUnique({
      where: { id: orgId },
    });

    if (!organization) {
      return res.status(404).json({ error: `organization ${orgId} not found` });
    }

    // Attach the organization object to the request
    req.organizations = organization;

    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
