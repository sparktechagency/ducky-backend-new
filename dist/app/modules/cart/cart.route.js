"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cart_controller_1 = require("./cart.controller");
const auth_1 = __importDefault(require("../../middleware/auth"));
const user_constants_1 = require("../user/user.constants");
const cartRouter = express_1.default.Router();
cartRouter
    .post('/create-cart', (0, auth_1.default)(user_constants_1.USER_ROLE.USER), 
// validateRequest(videoValidation.VideoSchema),
cart_controller_1.cartController.createCart)
    .get('/', (0, auth_1.default)(user_constants_1.USER_ROLE.USER), cart_controller_1.cartController.getAllCart)
    .patch('/:id/quantity/:action', (0, auth_1.default)(user_constants_1.USER_ROLE.USER), cart_controller_1.cartController.singleCartProductQuantityUpdate)
    .delete('/:id', cart_controller_1.cartController.deleteSingleCart);
exports.default = cartRouter;
