import express from "express";
import {
  getAllUsers,
  getSingleUser,
  deleteUser,
  getUserByEmail,
  getUserOrgs,
  getUserOrgsEmps,
  getUserOrgsProjects,
  getUserOrgsForms,
  getUserOrgsSubmissions,
  getUserOrgsReports
} from "./users.controllers.js";

const userRouter = express.Router();

userRouter.get("/", getAllUsers);
userRouter.get("/email", getUserByEmail);
userRouter.get("/:id", getSingleUser);
userRouter.get("/:userId/orgs", getUserOrgs);
userRouter.get("/:userId/orgs/employees", getUserOrgsEmps);
userRouter.get("/:userId/orgs/projects", getUserOrgsProjects);
userRouter.get("/:userId/orgs/forms", getUserOrgsForms);
userRouter.get("/:userId/orgs/submissions", getUserOrgsSubmissions);
userRouter.get("/:userId/orgs/reports", getUserOrgsReports);
userRouter.delete("/:id", deleteUser);

export default userRouter;
