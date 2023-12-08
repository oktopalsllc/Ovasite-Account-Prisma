import{
    createSubscription,
    getSubscriptions,
    getUserSubscription,
    updateSubscription,
    deleteSubscription,
    createPrice,
    getPrices,
    updatePrice
} from './subscription.controller.js';
import express from "express";

import {
    
    verifyUser
} from "../middleware/authenticate.js";
import { getCurrentOrganization } from '../middleware/getCurrentOrganization.js';

const subscriptionRouter = express.Router({ mergeParams: true });

subscriptionRouter.use('/:orgId', getCurrentOrganization);

subscriptionRouter.post('/:orgId/subscription/create', createSubscription);
subscriptionRouter.get('/:orgId/subscriptions', getSubscriptions);
subscriptionRouter.get('/:orgId/subscription/:userId', getUserSubscription);
subscriptionRouter.patch('/:orgId/subscription/update/:subscriptionId', updateSubscription);
subscriptionRouter.delete('/:orgId/subscription/delete/:subscriptionId', deleteSubscription);
subscriptionRouter.post('/:orgId/subscription/price/create', createPrice);
subscriptionRouter.get('/:orgId/subscription/prices', getPrices);
subscriptionRouter.patch('/:orgId/subscription/price/update/:priceId', updatePrice);

export default subscriptionRouter;