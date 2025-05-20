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
exports.settingsService = void 0;
const settings_model_1 = __importDefault(require("./settings.model"));
const AppError_1 = __importDefault(require("../../error/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const addSettings = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const existingSettings = yield settings_model_1.default.findOne({});
    if (existingSettings) {
        return existingSettings;
    }
    else {
        const result = yield settings_model_1.default.create(data);
        if (!result) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to add music');
        }
        return result;
    }
});
const getSettings = (title) => __awaiter(void 0, void 0, void 0, function* () {
    const settings = yield settings_model_1.default.findOne().select(title);
    if (title) {
        return { content: settings ? settings[title] : undefined }; // Check if settings exists
    }
    else {
        return settings;
    }
});
// Function to update settings without needing an ID
const updateSettings = (settingsBody) => __awaiter(void 0, void 0, void 0, function* () {
    // Find the existing settings document and update it
    const settings = yield settings_model_1.default.findOneAndUpdate({}, settingsBody, {
        new: true,
    });
    return settings;
});
exports.settingsService = {
    addSettings,
    updateSettings,
    getSettings,
};
