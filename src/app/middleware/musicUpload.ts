
// import multer from 'multer';
// import express from 'express';
// import path from 'path';

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
import multer from 'multer';
import path from 'path';

// Set up storage for Multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/uploads/music');  
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    },
});

// Set up Multer to handle audio uploads and cover images
const uploadMusic = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        // Only accept audio files and image files
        if (file.mimetype.startsWith('audio/') || file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('File is not a valid audio or image file'));
        }
    },
    limits: {
        fileSize: 10 * 1024 * 1024,  // Limit file size to 10MB
    }
});

export default uploadMusic;
