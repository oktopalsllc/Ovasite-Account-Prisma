import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function createAuditLog(
    userMail,
    ipAddress,
    orgId,
    type, 
    tableName, 
    oldValues, 
    newValues, 
    rowId) {
    return await prisma.audit.create({
        data: {
            userMail,
            ipAddress,
            orgId,
            type,
            tableName,
            oldValues,
            newValues,
            rowId
        }
    });
};

// export{
//     createAuditLog
// }