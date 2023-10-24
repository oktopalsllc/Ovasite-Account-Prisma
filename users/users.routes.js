import express from "express";
import {
  getAllUsers,
  getSingleUser,
  deleteUser,
  getUserByEmail
} from "./users.controllers.js";

const userRouter = express.Router();

userRouter.get("/", getAllUsers);
userRouter.get("/email", getUserByEmail);
userRouter.get("/:id", getSingleUser);
userRouter.delete("/:id", deleteUser);

export default userRouter;
