"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.howMadeController = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
const howMade_service_1 = require("./howMade.service");
const createHowMade = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = req.body;
    const madeFiles = req.files;
    console.log('madeFiles', madeFiles);
    if ((madeFiles === null || madeFiles === void 0 ? void 0 : madeFiles.image1) && madeFiles.image1.length > 0) {
        payload.image1 = madeFiles.image1[0].path.replace(/^public[\\/]/, '');
    }
    if ((madeFiles === null || madeFiles === void 0 ? void 0 : madeFiles.image2) && madeFiles.image2.length > 0) {
        payload.image2 = madeFiles.image2[0].path.replace(/^public[\\/]/, '');
    }
    if ((madeFiles === null || madeFiles === void 0 ? void 0 : madeFiles.video) && madeFiles.video.length > 0) {
        payload.video = madeFiles.video[0].path.replace(/^public[\\/]/, '');
    }
    const result = yield howMade_service_1.howMadeService.createHowMade(payload);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        data: result,
        message: 'Made Info Create successful!!',
    });
}));
const getAllHowMade = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { meta, result } = yield howMade_service_1.howMadeService.getAllHowMadeQuery(req.query);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        meta: meta,
        data: result,
        message: ' All HowMade are requered successful!!',
    });
}));
const getSingleHowMade = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield howMade_service_1.howMadeService.getSingleHowMadeQuery(req.params.id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        data: result,
        message: 'Single HowMade are requered successful!!',
    });
}));
const updateSingleHowMade = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const payload = req.body;
    const madeFiles = req.files;
    console.log('madeFiles', madeFiles);
    if ((madeFiles === null || madeFiles === void 0 ? void 0 : madeFiles.image1) && madeFiles.image1.length > 0) {
        payload.image1 = madeFiles.image1[0].path.replace(/^public[\\/]/, '');
    }
    if ((madeFiles === null || madeFiles === void 0 ? void 0 : madeFiles.image2) && madeFiles.image2.length > 0) {
        payload.image2 = madeFiles.image2[0].path.replace(/^public[\\/]/, '');
    }
    if ((madeFiles === null || madeFiles === void 0 ? void 0 : madeFiles.video) && madeFiles.video.length > 0) {
        payload.video = madeFiles.video[0].path.replace(/^public[\\/]/, '');
    }
    const result = yield howMade_service_1.howMadeService.updateSingleHowMadeStatusQuery(id, payload);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        data: result,
        message: 'Single HowMade status are updated successful!!',
    });
}));
const deleteSingleHowMade = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield howMade_service_1.howMadeService.deletedHowMadeQuery(req.params.id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        data: result,
        message: 'Deleted Single HowMade are successful!!',
    });
}));
exports.howMadeController = {
    createHowMade,
    getAllHowMade,
    getSingleHowMade,
    updateSingleHowMade,
    deleteSingleHowMade,
};
