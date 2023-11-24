import { PrismaClient } from "@prisma/client";
import asyncHandler from "express-async-handler";

const prisma = new PrismaClient();

const createFeedback = asyncHandler(async (req, res) => {
  const { name, email, rating, title, comment } = req.body;

  try {
    // Create a new feedback with the provided data
    const newFeedback = await prisma.feedback.create({
      data: {
        name,
        email,
        title,
        rating,
        comment,
      },
    });

    res.status(201).json(newFeedback);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

const getAllFeedback = asyncHandler(async (req, res) => {
  try {
    const feedback = await prisma.feedback.findMany();

    res.status(200).json(feedback);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const getFeedbackById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const feedback = await prisma.feedback.findUnique({
      where: { id },
    });

    if (!feedback) {
      res.status(404).json(`Feedback ${id} not found`);
    }

    res.status(200).json(feedback);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const deleteFeedback = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    // Check if the feedback with the specified ID exists
    const existingFeedback = await prisma.feedback.findUnique({
      where: { id },
    });

    if (!existingFeedback) {
      return res
        .status(404)
        .json({ error: `Feedback with ID ${id} not found.` });
    }

    await prisma.feedback.delete({
      where: { id },
    });

    res.status(204).json(`Feedback ${id} deleted`);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


export {
    createFeedback,
    deleteFeedback,
    getAllFeedback,
    getFeedbackById,
}