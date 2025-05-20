"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middleware/auth"));
const user_constants_1 = require("../user/user.constants");
const orders_controller_1 = require("./orders.controller");
const orderRouter = express_1.default.Router();
orderRouter
    .get('/', 
// auth(USER_ROLE.ADMIN), 
orders_controller_1.orderController.getAllOrder)
    .get('/user', (0, auth_1.default)(user_constants_1.USER_ROLE.USER), orders_controller_1.orderController.getAllOrderByUser)
    .get('/:id', orders_controller_1.orderController.getSingleOrder)
    .patch('/:id', orders_controller_1.orderController.updateSingleOrderStatus)
    .delete('/:id', 
// auth(USER_ROLE.ADMIN, USER_ROLE.SUB_ADMIN),
orders_controller_1.orderController.deleteSingleOrder);
exports.default = orderRouter;
