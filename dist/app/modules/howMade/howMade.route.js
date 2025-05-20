"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const fileUpload_1 = __importDefault(require("../../middleware/fileUpload"));
const howMade_controller_1 = require("./howMade.controller");
const howMadeRouter = express_1.default.Router();
const upload = (0, fileUpload_1.default)('./public/uploads/howMade');
howMadeRouter
    .post('/create-made', 
//  auth(USER_ROLE.ADMIN),
upload.fields([
    { name: 'image1', maxCount: 1 },
    { name: 'image2', maxCount: 1 },
    { name: 'video', maxCount: 1 },
]), howMade_controller_1.howMadeController.createHowMade)
    .get('/', 
//  auth(USER_ROLE.ADMIN),
howMade_controller_1.howMadeController.getAllHowMade)
    .get('/:id', howMade_controller_1.howMadeController.getSingleHowMade)
    .patch('/:id', upload.fields([
    { name: 'image1', maxCount: 1 },
    { name: 'image2', maxCount: 1 },
    { name: 'video', maxCount: 1 },
]), howMade_controller_1.howMadeController.updateSingleHowMade)
    .delete('/:id', 
// auth(USER_ROLE.ADMIN, USER_ROLE.SUB_ADMIN),
howMade_controller_1.howMadeController.deleteSingleHowMade);
exports.default = howMadeRouter;
