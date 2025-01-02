import express from "express";

import cors from "cors";

import cookieParser from "cookie-parser";

import bodyParser from "body-parser";

import commentRoutes from "./routes/comment.routes.js";
import likeRoutes from "./routes/like.routes.js";
import subscriptionRoutes from "./routes/subscription.routes.js";
import userRouter from "./routes/user.routes.js";
import videoRoutes from "./routes/video.routes.js";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(express.static("public"));
app.use(cookieParser());

// routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1/videos", videoRoutes);
app.use("/api/v1/comments", commentRoutes);
app.use("/api/v1/subscription", subscriptionRoutes);
app.use("/api/v1/likes", likeRoutes);

export { app };
