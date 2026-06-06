import {Router} from 'express';
const registrationRouter = Router();
import { createRegistration, cancelRegistration } from '../Controllers/registration.controller.js';

registrationRouter.post('/create/:eventId', createRegistration);
registrationRouter.post('/cancel/:eventId', cancelRegistration);


export { registrationRouter };