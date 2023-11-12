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
        const logs = await prisma.audit.findMany();
        res.status(201).json(logs);
    }
    catch (err) {
        next(err);
    }
});

// Get all org audit logs by orgId
const getOrgAuditLogs = asyncHandler(async (req, res, next) => {
    try {
        const orgId = req.params.orgId;
        const logs = await prisma.audit.findMany({
            where: {
                orgId: orgId,
            },
        });
        res.status(201).json(logs);
    } 
    catch (err) {
        next(err);
    }
});

// Get a specific audit log
const getAuditLog = asyncHandler(async (req, res, next) => {
    try {
        const { orgId, id } = req.params;
        const log = await prisma.audit.findUnique({
            where: {
                id: id,
                orgId: orgId
            },
        });
        if (!log) {
            throw new NotFoundError('Audit log not found');
        }
        res.status(201).json(log);
    } 
    catch (err) {
        next(err);
    }
});

// Delete a specific audit log
const deleteAuditLog = asyncHandler(async (req, res, next) => {
    try {
        const id = req.params.auditId;
        const deletedLog = await prisma.audit.delete({
            where: {
                id: id
            },
        });
        res.status(201).json(deletedLog);
    } 
    catch (err) {
        next(err);
    }
});

// Delete a specific org audit log
const deleteOrgAuditLog = asyncHandler(async (req, res, next) => {
    try {
        const { orgId, id } = req.params;
        const deletedLog = await prisma.audit.delete({
            where: {
                id: id,
                orgId: orgId
            },
        });
        res.status(201).json(deletedLog);
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