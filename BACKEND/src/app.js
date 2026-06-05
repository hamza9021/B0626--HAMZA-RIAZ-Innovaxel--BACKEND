import express from "express";
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });
import { eventRouter } from "./Routes/event.routes.js";

const app = express();
app.use(express.json());

app.use("/api/v1/events", eventRouter);




app.use("/health", (req, res) => {
    res.status(200).json({ message: "Server is healthy" });
});

export { app };
