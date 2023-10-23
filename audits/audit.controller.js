import { PrismaClient } from '@prisma/client';
import asyncHandler from "express-async-handler";
import { 
    ForbiddenError, 
    NotFoundError
} from '../middleware/errors.js';

const prisma = new PrismaClient();

// Get all audit logs
const getAuditLogs = asyncHandler(async (req, res, next) => {
    try {
        const orgId = req.params.orgId;
        if (!req.user || req.user.organizationId !== orgId) {
            throw new ForbiddenError('User is not within organization');
        }
        const logs = await prisma.audit.findMany();
        res.json(logs);
    }
    catch (err) {
        next(err);
    }
});

// Get all org audit logs by orgId
const getOrgAuditLogs = asyncHandler(async (req, res, next) => {
    try {
        const orgId = req.params.orgId;
        if (!req.user || req.user.organizationId !== orgId) {
            throw new ForbiddenError('User is not within organization');
        }
        const logs = await prisma.audit.findMany({
            where: {
                orgId: orgId,
            },
        });
        res.json(logs);
    } 
    catch (err) {
        next(err);
    }
});

// Get a specific audit log
const getAuditLog = asyncHandler(async (req, res, next) => {
    try {
        const { orgId, id } = req.params;
        if (!req.user || req.user.organizationId !== orgId) {
            throw new ForbiddenError('User is not within organization');
        }
        const log = await prisma.audit.findUnique({
            where: {
                id: id,
                orgId: orgId
            },
        });
        if (!log) {
            throw new NotFoundError('Audit log not found');
        }
        res.json(log);
    } 
    catch (err) {
        next(err);
    }
});

// Delete a specific audit log
const deleteAuditLog = asyncHandler(async (req, res, next) => {
    try {
        const id = req.params.auditId;
        if (!req.user || req.user.organizationId !== orgId) {
            throw new ForbiddenError('User is not within organization');
        }
        const deletedLog = await prisma.audit.delete({
            where: {
                id: id
            },
        });
        res.json(deletedLog);
    } 
    catch (err) {
        next(err);
    }
});

// Delete a specific org audit log
const deleteOrgAuditLog = asyncHandler(async (req, res, next) => {
    try {
        const { orgId, id } = req.params;
        if (!req.user || req.user.organizationId !== orgId) {
            throw new ForbiddenError('User is not within organization');
        }
        const deletedLog = await prisma.audit.delete({
            where: {
                id: id,
                orgId: orgId
            },
        });
        res.json(deletedLog);
    } 
    catch (err) {
        next(err);
    }
});

export{
    getAuditLogs,
    getOrgAuditLogs,
    getAuditLog,
    deleteAuditLog,
    deleteOrgAuditLog,
};