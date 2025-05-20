import httpStatus from 'http-status';
import jwt from 'jsonwebtoken';
import { JwtPayload } from 'jsonwebtoken';
import catchAsync from '../utils/catchAsync';
import AppError from '../error/AppError';
import config from '../config/index';
import { User } from '../modules/user/user.models';
import { verifyToken } from '../utils/tokenManage';

const auth = (...userRoles: string[]) => {
  return catchAsync(async (req, res, next) => {
    const token = req?.headers?.authorization?.split(' ')[1];
    // console.log('*****//***///**', token);
    if (!token) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'you are not authorized!');
    }

    const decodeData = verifyToken({
      token,
      access_secret: config.jwt_access_secret as string,
    });

    // console.log('decodeData', decodeData);
    const { role, userId, email } = decodeData;
    // // console.log('decodeData', decodeData);
    const isUserExist = await User.IsUserExistById(userId);

    if (!isUserExist) {
      throw new AppError(httpStatus.NOT_FOUND, 'user not found');
    }
    const user = await User.isUserActive(email);
    if (!user) {
      throw new AppError(httpStatus.BAD_REQUEST, 'User not found!!');
    }

    if (userRoles && !userRoles.includes(role)) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized');
    }
    req.user = decodeData;
    next();
  });
};
export default auth;
