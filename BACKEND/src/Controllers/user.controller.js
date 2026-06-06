import { ApiError } from "../Utils/ApiError.js";
import { ApiResponse } from "../Utils/ApiResponse.js";
import { User } from "../Models/user.model.js";
import { v4 as uuidv4 } from "uuid";

const createUser = async (req, res) => {
    const { fullName, email } = req.body;
    if (!fullName || !email) {
        throw new ApiError(400, "Missing required fields");
    }

    const user = {
        id: uuidv4(),
        fullName,
        email,
    };

    const users = new User();
    const userData = users.readUsers();

    if (userData.some((u) => u.email === email)) {
        throw new ApiError(400, "Email must be unique");
    }

    users.createUser(user);

    res.status(201).json(
        new ApiResponse(201, "User created successfully", user)
    );
};

export { createUser };
