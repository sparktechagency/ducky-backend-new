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
exports.User = void 0;
const mongoose_1 = require("mongoose");
const config_1 = __importDefault(require("../../config"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_constants_1 = require("./user.constants");
const userSchema = new mongoose_1.Schema({
    image: {
        type: String,
        default: '/uploads/profile/default-user.jpg',
    },
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        // unique: true,
    },
    role: {
        type: String,
        enum: user_constants_1.Role,
        required: true,
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
    phone: {
        type: String,
        required: false,
        default: '',
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    address: {
        type: String,
        required: false,
        default: '',
    },
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
    },
});
userSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const user = this;
        user.password = yield bcrypt_1.default.hash(user.password, Number(config_1.default.bcrypt_salt_rounds));
        next();
    });
});
// set '' after saving password
userSchema.post('save', 
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function (error, doc, next) {
    doc.password = '';
    next();
});
userSchema.methods.toJSON = function () {
    const user = this.toObject();
    delete user.password; // Remove password field
    return user;
};
// filter out deleted documents
userSchema.pre('find', function (next) {
    this.find({ isDeleted: { $ne: true } });
    next();
});
userSchema.pre('findOne', function (next) {
    this.find({ isDeleted: { $ne: true } });
    next();
});
userSchema.pre('aggregate', function (next) {
    this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
    next();
});
userSchema.statics.isUserExist = function (email) {
    return __awaiter(this, void 0, void 0, function* () {
        // console.log({ email });
        return yield exports.User.findOne({ email: email }).select('+password');
    });
};
userSchema.statics.isUserActive = function (email) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield exports.User.findOne({
            email: email,
            isDeleted: false,
            isActive: true,
        }).select('+password');
    });
};
userSchema.statics.IsUserExistById = function (id) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield exports.User.findById(id).select('+password');
    });
};
userSchema.statics.isPasswordMatched = function (plainTextPassword, hashedPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield bcrypt_1.default.compare(plainTextPassword, hashedPassword);
    });
};
exports.User = (0, mongoose_1.model)('User', userSchema);
