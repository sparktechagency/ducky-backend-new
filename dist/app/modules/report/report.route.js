"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middleware/auth"));
const user_constants_1 = require("../user/user.constants");
const report_controller_1 = require("./report.controller");
const reportRouter = express_1.default.Router();
reportRouter.post('/', (0, auth_1.default)(user_constants_1.USER_ROLE.USER), report_controller_1.reportController.createReport).get('/', 
//  auth(USER_ROLE.ADMIN),
report_controller_1.reportController.getAllReport);
exports.default = reportRouter;
