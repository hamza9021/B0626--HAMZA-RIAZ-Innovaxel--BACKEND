import { wrapperFunction } from "../Utils/asyncWrap.js";
import { ApiError } from "../Utils/ApiError.js";
import { ApiResponse } from "../Utils/ApiResponse.js";
import { Event } from "../Models/event.model.js";
import { v4 as uuidv4 } from "uuid";

const createEvent = async (req, res) => {
        const { eventName, totalSeats, eventDate } = req.body;

        if (!eventName || !totalSeats || !eventDate) {
            throw new ApiError(400, "Missing required fields");
        }

        if (Number(totalSeats) <= 0) {
            throw new ApiError(400, "Total seats must be greater than 0");
        }

        const event = {
            id: uuidv4(),
            eventName,
            totalSeats,
            eventDate,
        };

        const events = new Event();
        const eventData = events.readEvents();

        if (eventData.some((e) => e.eventName === eventName)) {
            throw new ApiError(400, "Event name must be unique");
        }

        const currentDate = new Date();
        const eventDateObj = new Date(eventDate);
        if (eventDateObj <= currentDate) {
            throw new ApiError(400, "Event date must be in the future");
        }

        events.createEvent(event);

        res.status(201).json(
            new ApiResponse(201, "Event created successfully", event)
        );
};

export { createEvent };
