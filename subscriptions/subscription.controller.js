import { getUserSubscriptionPlan, stripe, PLANS } from "../helpers/stripe.js";
import { PrismaClient } from "@prisma/client";
import asyncHandler from "express-async-handler";
import {
    ForbiddenError,
    NotFoundError
} from '../middleware/errors.js';
import { createAuditLog } from '../helpers/auditHelper.js';

const prisma = new PrismaClient();

/* Subscription */

// Create a subscription
const createSubscription = asyncHandler(async (req, res, next) => {
    try {
        const orgId = req.params.orgId;
        const {
            name,
            slug,
            numberOfOrgs,
            numberOfEmployees,
            numberOfProjects,
            numberOfForms,
            numberOfSubmissions
        } = req.body;

        const newSubscription = await prisma.subscription.create({
            data: {
                name,
                slug,
                numberOfOrgs,
                numberOfEmployees,
                numberOfProjects,
                numberOfForms,
                numberOfSubmissions
            },
        });
        await createAuditLog(
            req.user.email,
            req.ip || null,
            orgId,
            'create',
            'Subscription',
            '',
            JSON.stringify(newSubscription),
            newSubscription.id.toString()
        );
        res.json({ message: 'Subscription created successfully', status: true, newSubscription });
    }
    catch (err) {
        next(err);
    }
});

// Get a user subscription by the userId
const getUserSubscription = asyncHandler(async (req, res, next) => {
    try {
        const userId = req.params.userId;
        const plan = await getUserSubscriptionPlan(userId);
        if (!plan) throw new NotFoundError('Plan not found');
        res.json(plan);
    }
    catch (err) {
        next(err);
    }
});

// Get all subscriptions
const getSubscriptions = asyncHandler(async (req, res, next) => {
    try {
        const subscriptions = await prisma.subscription.findMany({
            include: { price: true },
        });

        res.json(subscriptions);
    }
    catch (err) {
        next(err);
    }
});

// Update a subscription by Id
const updateSubscription = asyncHandler(async (req, res, next) => {
    try {
        const { orgId, subscriptionId } = req.params;
        const {
            name,
            slug,
            numberOfOrgs,
            numberOfEmployees,
            numberOfProjects,
            numberOfForms,
            numberOfSubmissions
        } = req.body;
        const oldValues = await prisma.subscription.findUnique({
            where: {
                id: subscriptionId
            },
        });
        const updatedSubscription = await prisma.subscription.update({
            where: {
                id: subscriptionId
            },
            data: {
                name,
                slug,
                numberOfOrgs,
                numberOfEmployees,
                numberOfProjects,
                numberOfForms,
                numberOfSubmissions
            },
        });
        if(!updatedSubscription) throw new NotFoundError('Subscription not found');
        await createAuditLog(
            req.user.email,
            req.ip || null,
            orgId,
            'update',
            'Subscription',
            JSON.stringify(oldValues),
            JSON.stringify(updatedSubscription),
            oldValues.id.toString()
        );
        res.json({ message: 'Subscription updated successfully', status: true, updatedSubscription });
    }
    catch (err) {
        next(err);
    }
});

// Delete subscription by Id
const deleteSubscription = asyncHandler(async (req, res, next) => {
    try{
        const { orgId, subscriptionId } = req.params;
        const deletedSubscription = await prisma.subscription.delete({
            where: {
                id: subscriptionId
            },
        });
        if(!deletedSubscription) throw new NotFoundError('Subscription not found');
        await createAuditLog(
            req.user.email,
            req.ip || null,
            orgId,
            'delete',
            'Subscription',
            '',
            JSON.stringify(deletedSubscription),
            deletedSubscription.id.toString()
        );
        res.json({ message: 'Subscription deleted successfully', status: true, deletedSubscription });
    }
    catch (err) {
        next(err);
    }
});

/* Price */

// Create price
const createPrice = asyncHandler(async (req, res, next) => {
    try {
        const orgId = req.params.orgId;
        const { 
            amount, 
            testId, 
            productionId, 
            subscriptionId 
        } = req.body;
        const newPrice = await prisma.price.create({
            data: {
                amount,
                testId, 
                productionId, 
                subscriptionId 
            },
        });
        await createAuditLog(
            req.user.email,
            req.ip || null,
            orgId,
            'create',
            'Price',
            '',
            JSON.stringify(newPrice),
            newPrice.id.toString()
        );
        res.json({ message: 'Price created successfully', status: true, newPrice });
    }
    catch (err) {
        next(err);
    }
});

// Get all prices
const getPrices = asyncHandler(async (req, res, next) => {
    try {
        const prices = await prisma.price.findMany();
        res.json(prices);
    }
    catch (err) {
        next(err);
    }
});

// Update price by Id
const updatePrice = asyncHandler(async (req, res, next) => {
    try{
        const { orgId, priceId } = req.params;
        const { 
            amount, 
            testId, 
            productionId, 
            subscriptionId 
        } = req.body;
        const oldPrice = await prisma.price.findUnique({
            where: {
                id: priceId
            },
        });
        const updatedPrice = await prisma.price.update({
            where: {
                id: priceId
            },
            data: {
                amount,
                testId, 
                productionId, 
                subscriptionId
            },
        });
        if(!updatedPrice) throw new NotFoundError('Price not found');
        await createAuditLog(
            req.user.email,
            req.ip || null,
            orgId,
            'update',
            'Price',
            JSON.stringify(oldPrice),
            JSON.stringify(updatedPrice),
            oldPrice.id.toString()
        );
        res.json({ message: 'Price updated successfully', status: true, updatedPrice });
    }
    catch (err) {
        next(err);
    }
});

export{
    createSubscription,
    getSubscriptions,
    getUserSubscription,
    updateSubscription,
    deleteSubscription,
    createPrice,
    getPrices,
    updatePrice
}