"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const faq_controller_1 = require("./faq.controller");
const faqRouter = express_1.default.Router();
faqRouter
    .post('/create-faq', 
//  auth(USER_ROLE.ADMIN),
faq_controller_1.faqController.createFaq)
    .get('/', 
//  auth(USER_ROLE.ADMIN),
faq_controller_1.faqController.getAllFaq)
    .get('/:id', faq_controller_1.faqController.getSingleFaq)
    .patch('/:id', 
//  auth(USER_ROLE.ADMIN),
faq_controller_1.faqController.updateSingleFaq)
    .delete('/:id', 
// auth(USER_ROLE.ADMIN, USER_ROLE.SUB_ADMIN),
faq_controller_1.faqController.deleteSingleFaq);
exports.default = faqRouter;
