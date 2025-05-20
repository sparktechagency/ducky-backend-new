"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Role = exports.gender = exports.USER_ROLE = void 0;
exports.USER_ROLE = {
    SUPER_ADMIN: 'super_admin',
    SUB_ADMIN: 'sub_admin',
    ADMIN: 'admin',
    USER: 'user',
};
exports.gender = ['Male', 'Female', 'Others'];
exports.Role = Object.values(exports.USER_ROLE);
