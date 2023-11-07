import asyncHandler from 'express-async-handler';

import { OpenAI } from "langchain/llms/openai";
import { SqlDatabase } from "langchain/sql_db";
import { createSqlAgent, SqlToolkit } from "langchain/agents/toolkits/sql";
import { DataSource } from "typeorm";
import { configDotenv } from "dotenv";

// Load configuration
try {
  configDotenv();
} catch (e) {
  console.error("Error loading configuration:", e);
  process.exit(1);
}

// Create database connection
// const datasource = new DataSource({
//     type: "sqlite",
//     database: "./data/northwind.db",
//   });
const datasource = new DataSource({
  type: "postgres",
  host: "dpg-ckvqbmub0mos73btnlj0-a.oregon-postgres.render.com",
  port: 5432,
  username: "ovasite_db_user",
  password: "QqkQu2bJVVyvcx43okCEEKGrYrnSdPjq",
  database: "ovasite_db",
  ssl: true,
});
  const db = await SqlDatabase.fromDataSourceParams({
    appDataSource: datasource,
  });

const toolkit = new SqlToolkit(db);

// Create OpenAI model
const model = new OpenAI({
  temperature: 0,
});
const executor = createSqlAgent(model, toolkit);

// Creates a new project
const askAI = asyncHandler(async (req, res, next) => {
    return res.status(201).json({
        message: "OK"
    })
    const prompt = req.query.prompt;
  
    console.log("prompt: " + prompt);
  
    let response = {
      prompt: prompt,
      sqlQuery: "",
      result: [],
      error: "",
    };
  
    try {
      const result = await executor.call({ input: prompt });
  
      result.intermediateSteps.forEach((step) => {
        if (step.action.tool === "query-sql") {
          response.prompt = prompt;
          response.sqlQuery = step.action.toolInput;
          response.result = JSON.parse(step.observation);
        }
      });
  
      console.log(
        `Intermediate steps ${JSON.stringify(result.intermediateSteps, null, 2)}`
      );
  
      res.status(200).json(response);
    } catch (e) {
      console.log(e + " " + "my error message");
      response.error = "Server error. Try again with a different prompt.";
  
      res.status(500).json(response);
    }
  
});

// Export endpoints
export {
    askAI,
};