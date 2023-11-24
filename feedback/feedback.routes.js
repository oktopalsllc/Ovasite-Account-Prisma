// feedback.routes.js
import express from 'express';

import {
  createFeedback,
  deleteFeedback,
  getAllFeedback,
  getFeedbackById,
} from './feedback.controllers.js';

const feedbackRouter = express.Router();

feedbackRouter.post('/', createFeedback);
feedbackRouter.get('/', getAllFeedback);
feedbackRouter.get('/:id', getFeedbackById);
feedbackRouter.delete('/:id', deleteFeedback);

export default feedbackRouter;
