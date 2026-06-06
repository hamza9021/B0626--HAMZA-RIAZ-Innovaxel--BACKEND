import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class User {
    constructor() {
        this.usersFilePath = path.join(
            __dirname,
            "..",
            "..",
            "data",
            "users.json"
        );
    }

    readUsers() {
        const users = JSON.parse(fs.readFileSync(this.usersFilePath, "utf-8"));
        return users;
    }

    createUser(userData) {
        const users = this.readUsers();
        users.push(userData);
        fs.writeFileSync(this.usersFilePath, JSON.stringify(users));
    }
}

export { User };
