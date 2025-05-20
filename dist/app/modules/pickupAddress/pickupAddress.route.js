"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const pickupAddress_controller_1 = require("./pickupAddress.controller");
const pickupAddressRouter = express_1.default.Router();
pickupAddressRouter
    .post('/create-pickup-address', 
// auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
pickupAddress_controller_1.pickupAddressController.addPickupAddress)
    .get('/', pickupAddress_controller_1.pickupAddressController.getPickupAddresss)
    .patch('/', pickupAddress_controller_1.pickupAddressController.updatePickupAddress);
exports.default = pickupAddressRouter;
