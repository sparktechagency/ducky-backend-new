"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middleware/auth"));
const user_constants_1 = require("../user/user.constants");
const fileUpload_1 = __importDefault(require("../../middleware/fileUpload"));
const product_controller_1 = require("./product.controller");
const upload = (0, fileUpload_1.default)('./public/uploads/products');
const productRouter = express_1.default.Router();
productRouter
    .post('/create-product', (0, auth_1.default)(user_constants_1.USER_ROLE.ADMIN, user_constants_1.USER_ROLE.SUB_ADMIN), upload.fields([
    { name: 'images', maxCount: 10 },
    { name: 'coverImage', maxCount: 1 },
]), 
// validateRequest(videoValidation.VideoSchema),
product_controller_1.productController.createProduct)
    .get('/', product_controller_1.productController.getAllProduct)
    .get('/:id', (0, auth_1.default)(user_constants_1.USER_ROLE.USER), product_controller_1.productController.getSingleProduct)
    .get('/admin/:id', product_controller_1.productController.getAdminSingleProduct)
    .patch('/:id', 
// auth(USER_ROLE.ADMIN, USER_ROLE.SUB_ADMIN),
upload.fields([
    { name: 'images', maxCount: 10 },
    { name: 'coverImage', maxCount: 1 },
]), product_controller_1.productController.updateSingleProduct)
    .delete('/:id', 
// auth(USER_ROLE.ADMIN, USER_ROLE.SUB_ADMIN),
product_controller_1.productController.deleteSingleProduct);
exports.default = productRouter;
