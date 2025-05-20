"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = __importDefault(require("../../middleware/auth"));
const user_constants_1 = require("../user/user.constants");
const notification_controller_1 = require("./notification.controller");
const notificationRoutes = (0, express_1.Router)();
notificationRoutes.post('/create-notification', 
//   auth(USER_ROLE.USER),
//   validateRequest(paymnetValidation),
notification_controller_1.NotificationController.createNotification);
notificationRoutes.get('', (0, auth_1.default)(user_constants_1.USER_ROLE.USER), notification_controller_1.NotificationController.getAllNotificationByUser);
notificationRoutes.get('/admin-all', (0, auth_1.default)(user_constants_1.USER_ROLE.ADMIN), notification_controller_1.NotificationController.getAllNotificationByAdmin);
notificationRoutes.get('/:id', notification_controller_1.NotificationController.getSingleNotification);
notificationRoutes.delete('/:id', (0, auth_1.default)(user_constants_1.USER_ROLE.USER), notification_controller_1.NotificationController.deletedNotification);
notificationRoutes.delete('/admin/:id', (0, auth_1.default)(user_constants_1.USER_ROLE.ADMIN), notification_controller_1.NotificationController.deletedAdminNotification);
exports.default = notificationRoutes;
