import express from "express";

import cors from "cors";

import cookieParser from "cookie-parser";

import bodyParser from "body-parser";

import userRouter from "./routes/user.routes.js";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true})); // for parsing application/x-www-form-urlencoded
app.use(express.static("public"));
app.use(cookieParser());

// routes
app.use("/api/v1/users", userRouter);


export { app };
