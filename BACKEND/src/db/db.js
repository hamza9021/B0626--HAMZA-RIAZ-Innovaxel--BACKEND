import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class DB {

    init() {
        const dataFilePath = path.join(__dirname, "..", "..", "data");

        if (!fs.existsSync(dataFilePath)) {
            fs.mkdirSync(dataFilePath, { recursive: true });
        }

        const registrationFilePath = path.join(
            dataFilePath,
            "registration.json"
        );

        if (!fs.existsSync(registrationFilePath)) {
            fs.writeFileSync(registrationFilePath, JSON.stringify([]));
        }

        const eventsFilePath = path.join(dataFilePath, "events.json");

        if (!fs.existsSync(eventsFilePath)) {
            fs.writeFileSync(eventsFilePath, JSON.stringify([]));
        }

    }
}


export { DB };
