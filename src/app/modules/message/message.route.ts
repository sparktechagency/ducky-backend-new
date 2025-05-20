/** @format */

import { Router } from 'express';
import { messageController } from './message.controller';
// import multer, { memoryStorage } from "multer";
// import { messageController } from './message.controller.js';
// import parseData from '../../middlewares/parseData.js';
// import validateRequest from '../../middlewares/validateRequest.js';
// import { sendMessageValidation } from './message.validation.js';

const messageRouter = Router();
// const storage = memoryStorage();
// const upload = multer({ storage });

messageRouter.get('/', messageController.getAllMessages);

export default messageRouter;
