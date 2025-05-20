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
exports.chatController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const chat_service_1 = require("./chat.service");
const getAllChats = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const options = {
        limit: Number(req.query.limit) || 10,
        page: Number(req.query.page) || 1,
    };
    const { userId } = req.user;
    // console.log('userId=====================', userId);
    const filter = { participantId: userId };
    const search = req.query.search;
    // console.log('serch', search);
    if (search && search !== 'null' && search !== '' && search !== undefined) {
        const searchRegExp = new RegExp('.*' + search + '.*', 'i');
        filter.name = searchRegExp;
        // filter._id = search;
    }
    //  const { userId } = req.user;
    // // console.log({ filter });
    // // console.log({ options });
    const result = yield (0, chat_service_1.getChatByParticipantId)(filter, options);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        //    meta: meta,
        data: result,
        message: 'chat list get successfully!',
    });
}));
exports.chatController = {
    getAllChats,
};
