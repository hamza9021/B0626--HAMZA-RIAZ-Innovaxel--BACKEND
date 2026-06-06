import { ApiError } from "../Utils/ApiError.js";
import { ApiResponse } from "../Utils/ApiResponse.js";
import { Registration } from "../Models/registration.model.js";
import { Event } from "../Models/event.model.js";
import { v4 as uuidv4 } from "uuid";

const createRegistration = async (req, res) => {
    const { name, email } = req.body;
    const { eventId } = req.params;
    console.log(eventId);

    if (!name || !eventId || !email) {
        throw new ApiError(400, "Name, Event ID, and Email are required");
    }

    const events = new Event();
    const eventData = events.readEvents().find((event) => event.id === eventId);
    console.log(eventData);

    if (!eventData) {
        throw new ApiError(404, "Event not found");
    }

    const registration = new Registration();
    const registrationData = registration.readRegistrations();

    for (let reg of registrationData) {
        if (reg.email === email && reg.eventId === eventId) {
            throw new ApiError(400, "User already registered for this event");
        }
    }

    if (eventData.availableSeats <= 0) {
        throw new ApiError(400, "No seats available for this event");
    }

    const newRegistration = {
        id: uuidv4(),
        name,
        email,
        eventId,
        timestamp: new Date().toISOString(),
    };

    registration.registerUser(newRegistration);

    if (eventData.availableSeats > 0) {
        eventData.availableSeats -= 1;
        eventData.registrations.push(newRegistration.id);
        events.updateEvent(eventId, eventData);
    }

    return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                newRegistration,
                "Registration created successfully"
            )
        );
};

const cancelRegistration = async (req, res) => {
    const { eventId } = req.params;
    const { email } = req.body;

    if (!email || !eventId) {
        throw new ApiError(400, "Email and Event ID are required");
    }

    const registration = new Registration();
    const event = new Event();
    const registrationData = registration.readRegistrations();
    const eventData = event.readEvents().find((event) => event.id === eventId);

    if (!eventData) {
        throw new ApiError(404, "Event not found");
    }

    const regIndex = registrationData.findIndex(
        (reg) => reg.email === email && reg.eventId === eventId
    );

    if (regIndex === -1) {
        throw new ApiError(404, "Registration not found");
    }

    const regId = registrationData[regIndex].id;

    registration.cancelRegistration(regId);

    if (eventData.availableSeats < eventData.totalSeats) {
        eventData.availableSeats += 1;
        eventData.registrations = eventData.registrations.filter(
            (id) => id !== regId
        );
        event.updateEvent(eventId, eventData);
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, null, "Registration cancelled successfully")
        );
};

export { createRegistration, cancelRegistration };
