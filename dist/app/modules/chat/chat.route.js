"use strict";
/** @format */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = __importDefault(require("../../middleware/auth"));
const user_constants_1 = require("../user/user.constants");
const chat_controller_1 = require("./chat.controller");
const chatRouter = (0, express_1.Router)();
chatRouter.get('/', (0, auth_1.default)(user_constants_1.USER_ROLE.USER), chat_controller_1.chatController.getAllChats);
exports.default = chatRouter;
