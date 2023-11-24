import {
  verifyLogin,
  verifyRefreshToken,
  verifySuperAdmin,
} from "../middleware/authenticate.js";
import {
  changePassword,
  forgetPassword,
  handleRefreshToken,
  loginUser,
  logoutUser,
  registerAdminUser,
  registerUser,
  resetPassword,
} from "./auth.controllers.js";

import express from "express";

const authRouter = express.Router();

authRouter.post("/register", registerUser);
authRouter.post("/login", loginUser);
authRouter.post("/logout", verifyLogin, logoutUser);
authRouter.post("/register-admin", verifySuperAdmin, registerAdminUser);
authRouter.post("/forget-password", forgetPassword);
authRouter.post("/reset-password", resetPassword);
authRouter.post("/change-password", verifyLogin, changePassword);
authRouter.post("/refresh-token", verifyRefreshToken, handleRefreshToken);

export default authRouter;
