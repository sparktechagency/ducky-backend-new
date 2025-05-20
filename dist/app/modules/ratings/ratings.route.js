"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middleware/auth"));
const user_constants_1 = require("../user/user.constants");
const ratings_controller_1 = require("./ratings.controller");
const reviewRouter = express_1.default.Router();
reviewRouter
    .post('/', (0, auth_1.default)(user_constants_1.USER_ROLE.USER), 
// validateRequest(videoValidation.VideoSchema),
ratings_controller_1.reviewController.createReview)
    .get('/', ratings_controller_1.reviewController.getReviewByCustomer)
    .get('/:id', ratings_controller_1.reviewController.getSingleReview)
    .patch('/:id', (0, auth_1.default)(user_constants_1.USER_ROLE.USER), ratings_controller_1.reviewController.updateSingleReview)
    .delete('/:id', (0, auth_1.default)(user_constants_1.USER_ROLE.USER), ratings_controller_1.reviewController.deleteSingleReview);
exports.default = reviewRouter;
