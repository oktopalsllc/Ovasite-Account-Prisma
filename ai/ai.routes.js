import{
    askAI,
} from './ai.controller.js';
import express from "express";

import { 
    checkOrganizationExists 
} from '../organizations/organizations.middleware.js';

const aiRouter = express.Router({ mergeParams: true });

reportRouter.use('/:orgId', checkOrganizationExists);

aiRouter.get('/ask/:orgId', askAI);

export default aiRouter;