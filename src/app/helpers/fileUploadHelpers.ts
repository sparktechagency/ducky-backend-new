import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import multer from 'multer';
import httpStatus from 'http-status';
import AppError from '../error/AppError';
import config from '../config';
// import { ICloudinaryResponse, IUploadFile } from '../interface/file';

// Cloudinary configuration
// cloudinary.config({
//   cloud_name: config.cloudunary_cloud_name,
//   api_key: config.cloudunary_api_key,
//   api_secret: config.cloudunary_api_secret,
// });

const extractPublicIdFromUrl = (url: string): string | null => {
  const regex = /\/upload\/v\d+\/(.*?)(?=\.\w+$)/;
  const matches = url.match(regex);
  return matches ? matches[1] : null; // Return the public ID or null if not found
};

// Multer configuration for file storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/'); // Temporary upload folder
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`); // Unique file naming
  },
});

// Multer middleware for single and multiple file uploads
const upload = multer({ storage: storage });

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
export const FileUploadHelper = {
  upload, // Multer middleware
  // uploadToCloudinary, // Single file upload
  // uploadMultipleToCloudinary, // Multiple file uploads
  // deleteFromCloudinary,
};
