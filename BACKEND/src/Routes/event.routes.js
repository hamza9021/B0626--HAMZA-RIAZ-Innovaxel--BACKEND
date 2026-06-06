import {Router} from 'express';
const eventRouter = Router();
import { createEvent } from '../Controllers/event.controller.js';

eventRouter.post('/create', createEvent);

export { eventRouter };