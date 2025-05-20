"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = __importDefault(require("../../middleware/auth"));
const user_constants_1 = require("../user/user.constants");
const favorite_controller_1 = require("./favorite.controller");
const favoriteProductRoutes = (0, express_1.Router)();
favoriteProductRoutes.post('', (0, auth_1.default)(user_constants_1.USER_ROLE.USER), 
//   validateRequest(paymnetValidation),
favorite_controller_1.favoriteProductController.createFavoriteProduct);
favoriteProductRoutes.get('', (0, auth_1.default)(user_constants_1.USER_ROLE.USER), favorite_controller_1.favoriteProductController.getAllFavoriteProductByUser);
// saveStoryRoutes.delete(
//   '/:id',
//   auth(USER_ROLE.USER),
//   SaveStoryController.deletedSaveStory,
// );
exports.default = favoriteProductRoutes;
