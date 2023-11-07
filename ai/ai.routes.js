import{
    askAI,
} from './ai.controller.js';
import express from "express";

const aiRouter = express.Router({ mergeParams: true });

aiRouter.get('/ask', askAI);

export default aiRouter;