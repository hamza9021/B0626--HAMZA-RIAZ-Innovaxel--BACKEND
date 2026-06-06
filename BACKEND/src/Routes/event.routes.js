import { Router } from "express";
const eventRouter = Router();
import { createEvent, getAllEvents } from "../Controllers/event.controller.js";

eventRouter.post("/create", createEvent);
eventRouter.get("/", getAllEvents);

export { eventRouter };
