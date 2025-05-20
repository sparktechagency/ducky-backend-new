"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileUploadHelper = void 0;
const multer_1 = __importDefault(require("multer"));
// import { ICloudinaryResponse, IUploadFile } from '../interface/file';
// Cloudinary configuration
// cloudinary.config({
//   cloud_name: config.cloudunary_cloud_name,
//   api_key: config.cloudunary_api_key,
//   api_secret: config.cloudunary_api_secret,
// });
const extractPublicIdFromUrl = (url) => {
    const regex = /\/upload\/v\d+\/(.*?)(?=\.\w+$)/;
    const matches = url.match(regex);
    return matches ? matches[1] : null; // Return the public ID or null if not found
};
// Multer configuration for file storage
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/'); // Temporary upload folder
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`); // Unique file naming
    },
});
// Multer middleware for single and multiple file uploads
const upload = (0, multer_1.default)({ storage: storage });
// // Function to upload a single file to Cloudinary
// const uploadToCloudinary = async (
//   file: IUploadFile,
// ): Promise<ICloudinaryResponse | undefined> => {
//   return new Promise((resolve, reject) => {
//     cloudinary.uploader.upload(
//       file.path,
//       (error: Error, result: ICloudinaryResponse) => {
//         fs.unlinkSync(file.path); // Remove file from local storage
//         if (error) {
//           reject(new AppError(httpStatus.INTERNAL_SERVER_ERROR, error.message));
//         } else {
//           resolve(result); // Cloudinary response
//         }
//       },
//     );
//   });
// };
// // Function to delete a file from Cloudinary by its public ID
// const deleteFromCloudinary = async (url: string) => {
//   const publicId = extractPublicIdFromUrl(url);
//   if (!publicId) {
//     throw new AppError(httpStatus.BAD_REQUEST, 'Invalid file URL');
//   }
//   return new Promise((resolve, reject) => {
//     cloudinary.uploader.destroy(publicId, (error, result) => {
//       if (error) {
//         reject(new AppError(httpStatus.INTERNAL_SERVER_ERROR, error.message));
//       } else if (result.result !== 'ok') {
//         reject(
//           new AppError(
//             httpStatus.BAD_REQUEST,
//             `Failed to delete file: ${result.result}`,
//           ),
//         );
//       } else {
//         resolve('File deleted successfully');
//       }
//     });
//   });
// };
// // Function to upload multiple files to Cloudinary
// const uploadMultipleToCloudinary = async (
//   files: IUploadFile[],
// ): Promise<string[]> => {
//   const uploadPromises = files.map(
//     (file) =>
//       new Promise<string>((resolve, reject) => {
//         cloudinary.uploader.upload(
//           file.path,
//           (error: Error, result: ICloudinaryResponse) => {
//             fs.unlinkSync(file.path); // Remove the file from local storage
//             if (error) {
//               reject(error);
//             } else {
//               resolve(result.secure_url); // Return the uploaded image's URL
//             }
//           },
//         );
//       }),
//   );
//   return Promise.all(uploadPromises); // Wait for all uploads to complete
// };
exports.FileUploadHelper = {
    upload, // Multer middleware
    // uploadToCloudinary, // Single file upload
    // uploadMultipleToCloudinary, // Multiple file uploads
    // deleteFromCloudinary,
};
