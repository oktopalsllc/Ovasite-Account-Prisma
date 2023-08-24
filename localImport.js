// local imports
import connectDB from "./config/connectDB.js";
import authRouter from "./auth/auth.routes.js";
import userRouter from "./users/users.routes.js";

export { connectDB, authRouter, userRouter };
