"use strict";
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
Object.defineProperty(exports, "__esModule", { value: true });
const httpStatus = { BAD_REQUEST: 400, OK: 200, NOT_FOUND: 404 };
const notFound = (req, res, next) => {
    return res.status(httpStatus.NOT_FOUND).json({
        success: false,
        message: 'API Not Found !!',
        error: '',
    });
};
exports.default = notFound;
