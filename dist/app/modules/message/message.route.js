"use strict";
/** @format */
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const message_controller_1 = require("./message.controller");
// import multer, { memoryStorage } from "multer";
// import { messageController } from './message.controller.js';
// import parseData from '../../middlewares/parseData.js';
// import validateRequest from '../../middlewares/validateRequest.js';
// import { sendMessageValidation } from './message.validation.js';
const messageRouter = (0, express_1.Router)();
// const storage = memoryStorage();
// const upload = multer({ storage });
messageRouter.get('/', message_controller_1.messageController.getAllMessages);
exports.default = messageRouter;
