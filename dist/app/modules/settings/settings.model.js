"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const settingsSchema = new mongoose_1.Schema({
    privacyPolicy: {
        type: String,
        default: '',
    },
    aboutUs: {
        type: String,
        default: '',
    },
    support: {
        type: String,
        default: '',
    },
    termsOfService: {
        type: String,
        default: '',
    },
}, { timestamps: true });
// Create the model
const Settings = (0, mongoose_1.model)('Settings', settingsSchema);
exports.default = Settings;
