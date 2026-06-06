import express from "express";
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });
import { eventRouter } from "./Routes/event.routes.js";
import { userRouter } from "./Routes/user.routes.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "20kb" }));
app.use("/api/v1/events", eventRouter);
app.use("/api/v1/users", userRouter);

app.use("/health", (req, res) => {
    res.status(200).json({ message: "Server is healthy" });
});

export { app };
