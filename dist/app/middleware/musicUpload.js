"use strict";
// import multer from 'multer';
// import express from 'express';
// import path from 'path';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, './public/uploads/music'); // Destination folder for uploaded files
//     },
//     filename: function (req, file, cb) {
//         const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
//         cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname)); // Custom filename
//     },
// });
// const uploadMusic = multer({ storage: storage });
// export default uploadMusic
// middleware/musicUpload.ts
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
// Set up storage for Multer
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/uploads/music');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path_1.default.extname(file.originalname));
    },
});
// Set up Multer to handle audio uploads and cover images
const uploadMusic = (0, multer_1.default)({
    storage: storage,
    fileFilter: function (req, file, cb) {
        // Only accept audio files and image files
        if (file.mimetype.startsWith('audio/') || file.mimetype.startsWith('image/')) {
            cb(null, true);
        }
        else {
            cb(new Error('File is not a valid audio or image file'));
        }
    },
    limits: {
        fileSize: 10 * 1024 * 1024, // Limit file size to 10MB
    }
});
exports.default = uploadMusic;
