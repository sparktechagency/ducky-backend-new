"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const shipmentApi_controller_1 = require("./shipmentApi.controller");
const shippingRouter = express_1.default.Router();
shippingRouter
    .post('/create-shipping', 
// auth(USER_ROLE.USER),
// validateRequest(videoValidation.VideoSchema),
shipmentApi_controller_1.shippingController.createShipping)
    .post('/create-shipping-request/:id', 
// auth(USER_ROLE.USER),
// validateRequest(videoValidation.VideoSchema),
shipmentApi_controller_1.shippingController.createShippingRequest)
    .post('/rates', 
// auth(USER_ROLE.USER),
// validateRequest(videoValidation.VideoSchema),
shipmentApi_controller_1.shippingController.createShippingRates)
    .get('/', shipmentApi_controller_1.shippingController.getAllShipping)
    .get('/request', shipmentApi_controller_1.shippingController.getAllShippingRequest)
    .get('/:id', shipmentApi_controller_1.shippingController.getSingleShipping)
    .delete('/:id', shipmentApi_controller_1.shippingController.deleteSingleShipping);
exports.default = shippingRouter;
