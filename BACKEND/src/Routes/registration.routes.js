import {Router} from 'express';
const registrationRouter = Router();
import { createRegistration } from '../Controllers/registration.controller.js';

registrationRouter.post('/create/:eventId', createRegistration);


export { registrationRouter };