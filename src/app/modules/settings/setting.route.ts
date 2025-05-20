import express, { Request, Response } from 'express';
import { settingsController } from './settings.controller';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constants';

const settingsRouter = express.Router();

settingsRouter
  .post(
    '/',
    // auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
    settingsController.addSetting,
  )
  .get('/', settingsController.getSettings)
  .patch('/', settingsController.updateSetting);

export default settingsRouter;
