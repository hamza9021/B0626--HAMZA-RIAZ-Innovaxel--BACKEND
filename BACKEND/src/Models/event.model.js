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
}


export { Event };