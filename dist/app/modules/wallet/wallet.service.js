"use strict";
// import { Types } from 'mongoose';
// import AppError from '../../error/AppError';
// import { User } from '../user/user.models';
// import { TWallet } from './wallet.interface';
// import { Wallet } from './wallet.model';
// const addWalletService = async (mentorId: string) => {
//   if (!mentorId) {
//     throw new AppError(400, 'Mentor ID is required!');
//   }
//   if (!Types.ObjectId.isValid(mentorId)) {
//     throw new AppError(400, 'Invalid Mentor ID format!');
//   }
//   const mentor = await User.findById(mentorId);
//   if (!mentor) {
//     throw new AppError(404, 'Mentor not found!');
//   }
//   if (mentor.role !== 'mentor') {
//     throw new AppError(400, 'The user is not a mentor!');
//   }
//   const payload: TWallet = {
//     mentorId: new Types.ObjectId(mentorId), 
//     amount: 0, 
//   };
//   const result = await Wallet.create(payload);
//   return result;
// };
// const userWalletGetService = async (mentorId: string) => {
//   if (!mentorId) {
//     throw new AppError(400, 'Mentor ID is required!');
//   }
//   if (!Types.ObjectId.isValid(mentorId)) {
//     throw new AppError(400, 'Invalid Mentor ID format!');
//   }
//   const mentor = await User.findById(mentorId);
//   if (!mentor) {
//     throw new AppError(404, 'Mentor not found!');
//   }
//   if (mentor.role !== 'mentor') {
//     throw new AppError(400, 'The user is not a mentor!');
//   }
//   const wallet = await Wallet.findOne({ mentorId });
//   return wallet;
// };
// const deletedWallet = async (mentorId: string) => {
//   if (!mentorId) {
//     throw new AppError(400, 'Mentor ID is required!');
//   }
//   if (!Types.ObjectId.isValid(mentorId)) {
//     throw new AppError(400, 'Invalid Mentor ID format!');
//   }
//   const mentor = await User.findById(mentorId);
//   if (!mentor) {
//     throw new AppError(404, 'Mentor not found!');
//   }
//   if (mentor.role !== 'mentor') {
//     throw new AppError(400, 'The user is not a mentor!');
//   }
//   const wallet = await Wallet.findOne({ mentorId });
//   if (!wallet) {
//     throw new AppError(404, 'Wallet not found!');
//   }
//   const result = await Wallet.findOneAndDelete({ mentorId });
//   return result;
//   }
// export const walletService = {
//   addWalletService,
//   userWalletGetService,
//   deletedWallet,
// };
