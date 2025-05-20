"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const handleMulterError = (err) => {
    let errorSources = [
        { path: '', message: 'File upload error' },
    ];
    switch (err.code) {
        case 'LIMIT_FILE_SIZE':
            errorSources = [
                { path: 'file', message: 'File size is too large. Maximum is 5MB.' },
            ];
            break;
        case 'LIMIT_UNEXPECTED_FILE':
            errorSources = [
                { path: 'file', message: 'Too many files uploaded. Only one allowed.' },
            ];
            break;
        default:
            errorSources = [{ path: 'file', message: err.message }];
            break;
    }
    const statusCode = 400;
    return {
        statusCode,
        message: 'File upload validation error',
        errorSources,
    };
};
exports.default = handleMulterError;
