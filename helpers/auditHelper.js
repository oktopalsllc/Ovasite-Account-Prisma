import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function createAuditLog(
    userMail,
    userIpAddress,
    orgId,
    type, 
    tableName, 
    oldValues, 
    newValues, 
    primaryKey) {
    return await prisma.audit.create({
        data: {
            userMail,
            userIpAddress,
            orgId,
            type,
            tableName,
            oldValues,
            newValues,
            primaryKey
        }
    });
};

// export{
//     createAuditLog
// }