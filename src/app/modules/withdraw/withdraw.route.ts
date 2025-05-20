import express from 'express';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constants';
import { withdrawController } from './withdraw.controller';


const withdrawRouter = express.Router();

withdrawRouter
  .post('/add-payment', auth(USER_ROLE.USER), withdrawController.addWithdraw)
  .get('/', auth(USER_ROLE.ADMIN), withdrawController.getAllWithdraw)
  .get(
    '/business',
    auth(USER_ROLE.USER),
    withdrawController.getAllWithdrawByBusinessMan,
  )
  .get('/:id', withdrawController.getSingleWithdraw)
  .delete('/:id', withdrawController.deleteSingleWithdraw);

export default withdrawRouter;
