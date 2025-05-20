"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const multer_1 = __importDefault(require("multer"));
const fileUpload = (uploadDirectory) => {
    if (!fs_1.default.existsSync(uploadDirectory)) {
        fs_1.default.mkdirSync(uploadDirectory, { recursive: true });
    }
    const storage = multer_1.default.diskStorage({
        destination: function (req, file, cb) {
            cb(null, uploadDirectory);
        },
        filename: function (req, file, cb) {
            const parts = file.originalname.split('.');
            let extenson;
            if (parts.length > 1) {
                extenson = '.' + parts.pop();
            }
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
            cb(null, parts.shift().replace(/\s+/g, '_') + '-' + uniqueSuffix + extenson);
        },
    });
    const upload = (0, multer_1.default)({
        storage,
        limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB limit for video files
        fileFilter: (req, file, cb) => {
            const allowedMimeTypes = [
                'image/gif',
                'image/png',
                'image/jpg',
                'image/jpeg',
                'image/svg',
                'image/webp',
                'application/octet-stream',
                'image/svg+xml',
                'audio/mpeg',
                'audio/wav',
                'audio/ogg',
                'audio/mp3',
                'audio/aac',
                'audio/x-wav',
                'video/mp4',
                'video/webm',
                'video/avi',
                'video/mov',
                'video/mkv',
                'application/pdf', // PDF files
                'application/msword', // .doc files
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            ];
            if (allowedMimeTypes.includes(file.mimetype)) {
                cb(null, true);
            }
            else {
                cb(new Error('Only image and video formats like png, jpg, jpeg, svg, webp, mp4, avi, mov, and mkv are allowed'));
            }
        },
    });
    return upload;
};
exports.default = fileUpload;
