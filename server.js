import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";

import {
  authRouter,
  userRouter,
  organizationsRouter,
  employeeRouter,
  teamsRouter,
  inviteRouter,
  projectRouter,
  formRouter,
  submissionRouter,
  reportRouter
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
  res.send("<h1>Welcome</h1>");
});

const basePath = "/api/v1";
// Authentication
app.use(`${basePath}/auth`, authRouter);
app.use(`${basePath}/users`, userRouter);

// Administration (Organization)
app.use(`${basePath}/organizations`, organizationsRouter);
app.use(`${basePath}/organizations`, employeeRouter);
app.use(`${basePath}/invites`, inviteRouter);
app.use(`${basePath}/organizations`, teamsRouter);
app.use(`${basePath}/projects`, projectRouter);
app.use(`${basePath}/forms`, formRouter);
app.use(`${basePath}/submissions`, submissionRouter);
app.use(`${basePath}/reports`, reportRouter);

//Connect to the database before listening
const PORT = process.env.PORT || process.env.API_PORT;
console.log("Port: " + PORT);

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
