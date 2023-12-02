import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { errorHandler } from "./middleware/errors.js";

import {
  auditRouter,
  authRouter,
  employeeRouter,
  feedbackRouter,
  formRouter,
  inviteRouter,
  organizationsRouter,
  projectRouter,
  reportRouter,
  submissionRouter,
  subscriptionRouter,
  userRouter,
} from "./localImport.js";
dotenv.config();

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:3002",
      "http://localhost:3003",
      "https://ovasite.vercel.app",
      "https://ovasiteapp.vercel.app",
    ],
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
    credentials: true,
  })
);
// app.use(csurf({ cookie: true }));

// Helmet for setting secure HTTP headers
app.use(helmet());

// Morgan for HTTP request logging
app.use(morgan("dev"));
//Routes go here
app.get("/", (req, res) => {
  res.send("<h1>Healthy🎉🎊</h1>");
});

app.use(errorHandler);

const basePath = "/api/v1";
// Authentication
app.use(`${basePath}/auth`, authRouter);
app.use(`${basePath}/users`, userRouter);

app.use(`${basePath}/feedback`, feedbackRouter);

// Administration (Organization)
app.use(`${basePath}/orgs`, organizationsRouter);
app.use(`${basePath}/orgs`, employeeRouter);
app.use(`${basePath}/invites`, inviteRouter);
app.use(`${basePath}/orgs`, projectRouter);
app.use(`${basePath}/orgs`, formRouter);
app.use(`${basePath}/orgs`, submissionRouter);
app.use(`${basePath}/orgs`, reportRouter);
app.use(`${basePath}/orgs`, auditRouter);
app.use(`${basePath}/orgs`, subscriptionRouter);

//Connect to the database before listening
const PORT = process.env.PORT || process.env.API_PORT;
console.log("Port: " + PORT);

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
