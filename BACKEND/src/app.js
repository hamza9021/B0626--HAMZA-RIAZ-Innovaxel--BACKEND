import express from "express";
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });




const app = express();

app.use("/health", (req, res) => {
    res.status(200).json({ message: "Server is healthy" });
});

export { app };
