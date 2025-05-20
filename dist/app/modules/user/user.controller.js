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
exports.userController = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const user_service_1 = require("./user.service");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const fileHelper_1 = require("../../utils/fileHelper");
const http_status_1 = __importDefault(require("http-status"));
const createUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log("user body", req.body);
    const createUserToken = yield user_service_1.userService.createUserToken(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Check email for OTP',
        data: { createUserToken },
    });
}));
const userCreateVarification = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const token = (_a = req.headers) === null || _a === void 0 ? void 0 : _a.token;
    const { otp } = req.body;
    const newUser = yield user_service_1.userService.otpVerifyAndCreateUser({ otp, token });
    return (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'User create successfully',
        data: newUser,
    });
}));
// const userSwichRole = catchAsync(async (req, res) => {
//   const { userId } = req.user;
//   const newUser = await userService.userSwichRoleService(userId);
//   return sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: 'Swich role successfully',
//     data: newUser,
//   });
// });
// rest >...............
const getAllUsers = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_service_1.userService.getAllUserQuery(req.query);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        meta: result.meta,
        data: result.result,
        message: 'Users All are requered successful!!',
    });
}));
const getAllUserCount = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_service_1.userService.getAllUserCount();
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        data: result,
        message: 'Users All Count successful!!',
    });
}));
const getAllUserRasio = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const yearQuery = req.query.year;
    // Safely extract year as string
    const year = typeof yearQuery === 'string' ? parseInt(yearQuery) : undefined;
    if (!year || isNaN(year)) {
        return (0, sendResponse_1.default)(res, {
            success: false,
            statusCode: http_status_1.default.BAD_REQUEST,
            message: 'Invalid year provided!',
            data: {},
        });
    }
    const result = yield user_service_1.userService.getAllUserRatio(year);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        data: result,
        message: 'Users All Ratio successful!!',
    });
}));
const getUserById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_service_1.userService.getUserById(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'User fetched successfully',
        data: result,
    });
}));
const getMyProfile = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const result = yield user_service_1.userService.getUserById((_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.userId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'profile fetched successfully',
        data: result,
    });
}));
const updateMyProfile = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    if (req === null || req === void 0 ? void 0 : req.file) {
        req.body.image = (0, fileHelper_1.storeFile)('profile', (_a = req === null || req === void 0 ? void 0 : req.file) === null || _a === void 0 ? void 0 : _a.filename);
    }
    const result = yield user_service_1.userService.updateUser((_b = req === null || req === void 0 ? void 0 : req.user) === null || _b === void 0 ? void 0 : _b.userId, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'profile updated successfully',
        data: result,
    });
}));
const blockedUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_service_1.userService.blockedUser(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'User Blocked successfully',
        data: result,
    });
}));
const deleteMyAccount = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const result = yield user_service_1.userService.deleteMyAccount((_a = req.user) === null || _a === void 0 ? void 0 : _a.userId, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'User deleted successfully',
        data: result,
    });
}));
exports.userController = {
    createUser,
    userCreateVarification,
    // userSwichRole,
    getUserById,
    getMyProfile,
    updateMyProfile,
    blockedUser,
    deleteMyAccount,
    getAllUsers,
    getAllUserCount,
    getAllUserRasio,
};
