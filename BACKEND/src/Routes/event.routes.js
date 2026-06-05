import {Router} from 'express';
const eventRouter = Router();
import { createEvent } from '../Controllers/event.controllers.js';

eventRouter.post('/create', createEvent);

export { eventRouter };