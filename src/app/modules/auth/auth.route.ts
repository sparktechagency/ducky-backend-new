import { Router } from 'express';
import { authControllers } from './auth.controller';
import auth from '../../middleware/auth';
import validateRequest from '../../middleware/validateRequest';
import { authValidation } from './auth.validation';
import { USER_ROLE } from '../user/user.constants';

export const authRoutes = Router();

authRoutes
  .post('/login', authControllers.login)
  .post(
    '/refresh-token',
    // validateRequest(authValidation.refreshTokenValidationSchema),
    authControllers.refreshToken,
  )
  .post(
    '/forgot-password-otp',
    validateRequest(authValidation.forgetPasswordValidationSchema),
    authControllers.forgotPassword,
  )
  .patch(
    '/change-password',
    auth(
      USER_ROLE.USER,
      USER_ROLE.ADMIN,
      USER_ROLE.SUB_ADMIN,
      USER_ROLE.SUPER_ADMIN,
    ),
    authControllers.changePassword,
  )

  .patch(
    '/forgot-password-otp-match',
    validateRequest(authValidation.otpMatchValidationSchema),
    authControllers.forgotPasswordOtpMatch,
  )
  .patch(
    '/forgot-password-reset',
    validateRequest(authValidation.resetPasswordValidationSchema),
    authControllers.resetPassword,
  );
