import { ApiError } from "../Utils/ApiError.js";
import { ApiResponse } from "../Utils/ApiResponse.js";
import { Registration } from "../Models/registration.model.js";
import { v4 as uuidv4 } from "uuid";

const createRegistration = async (req, res) => {
    const { name } = req.body;
    const { id } = req.id;
    console.log(id);

    if(!name || !id){
        throw new ApiError(400, "Name and ID are required");
    }

    const registrations = new Registration();
    const registrationData = registrations.getRegistrations();

    

};
