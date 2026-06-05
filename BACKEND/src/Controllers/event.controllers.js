import { wrapperFunction } from "../Utils/asyncWrap.js";
import { ApiError } from "../Utils/ApiError.js";
import { ApiResponse } from "../Utils/ApiResponse.js";
import { Event } from "../Models/event.model.js";
import { v4 as uuidv4 } from "uuid";

const createEvent = async (req, res) => {
    try {
        const { eventName, totalSeats, eventDate } = req.body;

        if (!eventName || !totalSeats || !eventDate) {
            throw new ApiError(400, "Missing required fields");
        }

        if (typeof eventName !== "string" || typeof totalSeats !== "number" || typeof eventDate !== "string") {
            throw new ApiError(400, "Invalid data types for one or more fields");
        }

        if(totalSeats<=0){
            throw new ApiError(400, "Total seats must be greater than 0");
        }

        const event = {
            id: uuidv4(),
            eventName,
            totalSeats,
            eventDate,
        };

        const event = new Event();
        const eventData = event.readEvents();

        if (eventData.some((e) => e.eventName === eventName)) {
            throw new ApiError(400, "Event name must be unique");
        }

        const currentDate = new Date();
        const eventDateObj = new Date(eventDate);
        if (eventDateObj <= currentDate) {
            throw new ApiError(400, "Event date must be in the future");
        }

        event.createEvent(event);

        res.status(201).json(
            new ApiResponse(201, "Event created successfully", event)
        );

    } catch (err) {
        throw new ApiError(
            500,
            "Failed to create event (Internal Server Error)"
        );
    }
};


export { createEvent };