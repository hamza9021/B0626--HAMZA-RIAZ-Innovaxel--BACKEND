import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class Registration {
    constructor() {
        this.registrationsFilePath = path.join(
            __dirname,
            "..",
            "..",
            "data",
            "registration.json"
        );
    }

    readRegistrations() {
        const registrations = JSON.parse(
            fs.readFileSync(this.registrationsFilePath, "utf-8")
        );
        return registrations;
    }

    registerUser(userData){
        const registrations = this.readRegistrations();
        registrations.push(userData);
        fs.writeFileSync(this.registrationsFilePath, JSON.stringify(registrations));
    }
}

export { Registration };
