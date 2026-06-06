import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class Event {
    constructor() {
        this.eventsFilePath = path.join(
            __dirname,
            "..",
            "..",
            "data",
            "events.json"
        );
    }

    readEvents() {
        const events = JSON.parse(
            fs.readFileSync(this.eventsFilePath, "utf-8")
        );
        return events;
    }

    createEvent(eventData) {
        const events = this.readEvents();
        events.push(eventData);
        fs.writeFileSync(this.eventsFilePath, JSON.stringify(events));
    }

    updateEvent(eventId, updatedData) {
        const events = this.readEvents();
        const eventIndex = events.findIndex((event) => event.id === eventId);
        if (eventIndex === -1) {
            throw new Error("Event not found");
        }
        events[eventIndex] = { ...events[eventIndex], ...updatedData };
        fs.writeFileSync(this.eventsFilePath, JSON.stringify(events));
    }
}


export { Event };