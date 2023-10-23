import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import { errorHandler } from "./middleware/errors.js";

import {
  authRouter,
  userRouter,
  organizationsRouter,
  employeeRouter,
  inviteRouter,
  projectRouter,
  formRouter,
  submissionRouter,
  reportRouter,
  auditRouter
} from "./localImport.js";
dotenv.config();

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());
// app.use(csurf({ cookie: true }));
// app.use(helmet());

//Routes go here
app.get("/", (req, res) => {
  res.send("<h1>Healthy🎉🎊</h1>");
});

app.use(errorHandler);

const basePath = "/api/v1";
// Authentication
app.use(`${basePath}/auth`, authRouter);
app.use(`${basePath}/users`, userRouter);

// Administration (Organization)
app.use(`${basePath}/orgs`, organizationsRouter);
app.use(`${basePath}/orgs`, employeeRouter);
app.use(`${basePath}/invites`, inviteRouter);
app.use(`${basePath}/orgs`, projectRouter);
app.use(`${basePath}/orgs`, formRouter);
app.use(`${basePath}/orgs`, submissionRouter);
app.use(`${basePath}/orgs`, reportRouter);
app.use(`${basePath}/orgs`, auditRouter);

//Connect to the database before listening
const PORT = process.env.PORT || process.env.API_PORT;
console.log("Port: " + PORT);

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
