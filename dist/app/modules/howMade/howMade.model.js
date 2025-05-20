"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const AppError_1 = __importDefault(require("../../error/AppError"));
const howMadeSchema = new mongoose_1.Schema({
    category: {
        type: String,
        enum: ['text', 'image', 'video'],
        required: true,
    },
    title: { type: String, required: true },
    details: { type: String, required: true },
    firstName: { type: String, required: false },
    secondName: { type: String, required: false },
    image1: { type: String, required: false },
    image2: { type: String, required: false },
    video: { type: String, required: false },
}, { timestamps: true });
howMadeSchema.pre('save', function (next) {
    if (this.category === 'text') {
        if (!this.title || !this.details) {
            throw new AppError_1.default(403, 'Title and Details are required for category "text"!');
        }
        if (this.firstName || this.secondName || this.image1 || this.image2 || this.video) {
            throw new AppError_1.default(403, 'firstName, secondName, image1, image2 are not required for category "text"!');
        }
    }
    else if (this.category === 'image') {
        if (!this.title ||
            !this.details ||
            !this.firstName ||
            !this.secondName ||
            !this.image1 ||
            !this.image2) {
            throw new AppError_1.default(403, 'Title, firstName, secondName, image1, image2 and details are required for category "image"!');
        }
        if (this.video) {
            throw new AppError_1.default(403, 'firstName, secondName, image1, image2 are not required for category "text"!');
        }
    }
    else if (this.category === 'video') {
        if (!this.title || !this.details || !this.video) {
            throw new AppError_1.default(403, 'Title, details, and video are required for category "video"!');
        }
        if (this.firstName ||
            this.secondName ||
            this.image1 ||
            this.image2) {
            throw new AppError_1.default(403, 'firstName, secondName, image1, image2 are not required for category "text"!');
        }
    }
    next();
});
const HowMade = mongoose_1.default.model('HowMade', howMadeSchema);
exports.default = HowMade;
