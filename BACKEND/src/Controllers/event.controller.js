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
        availableSeats: totalSeats,
        registrations: [],
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

const getAllEvents = async (req, res) => {
    const { upcoming, sort = "asc" } = req.query;

    const events = new Event();
    let eventData = events.readEvents();

    if (!eventData || eventData.length === 0) {
        throw new ApiError(404, "No events found");
    }

    if (upcoming === "true") {
        const now = new Date();
        eventData = eventData.filter(
            (event) => new Date(event.eventDate) > now
        );

        if (eventData.length === 0) {
            throw new ApiError(404, "No upcoming events found");
        }
    }

    const sortOrder = sort === "desc" ? -1 : 1;
    eventData.sort(
        (a, b) => sortOrder * (new Date(a.eventDate) - new Date(b.eventDate))
    );

    const formattedEvents = eventData.map((event) => ({
        availableSeats: Number(event.availableSeats),
        totalRegistrations: Array.isArray(event.registrations)
            ? event.registrations.length
            : 0,
        status: new Date(event.eventDate) > new Date() ? "upcoming" : "past",
    }));

    res.status(200).json(
        new ApiResponse(200, "Events retrieved successfully", {
            events: formattedEvents,
        })
    );
};

export { createEvent, getAllEvents };
