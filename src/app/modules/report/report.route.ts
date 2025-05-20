import express from 'express';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constants';
import { reportController } from './report.controller';

const reportRouter = express.Router();


reportRouter.post('/', auth(USER_ROLE.USER), reportController.createReport).get(
  '/',
  //  auth(USER_ROLE.ADMIN),
  reportController.getAllReport,
);

export default reportRouter;
