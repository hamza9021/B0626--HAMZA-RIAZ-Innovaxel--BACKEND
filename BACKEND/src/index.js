import { app } from "./app.js";
import { DB } from "./db/db.js";

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
    const db = new DB();
    db.init();
    console.log("Database initialized");
});
