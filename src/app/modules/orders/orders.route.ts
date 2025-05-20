import express from 'express';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constants';
import fileUpload from '../../middleware/fileUpload';
import { orderController } from './orders.controller';


const orderRouter = express.Router();

orderRouter
  .get('/', 
    // auth(USER_ROLE.ADMIN), 
    orderController.getAllOrder)
  .get('/user', auth(USER_ROLE.USER), orderController.getAllOrderByUser)
  .get('/:id', orderController.getSingleOrder)
  .patch('/:id', orderController.updateSingleOrderStatus)
  .patch('/update/:id',
    auth(USER_ROLE.ADMIN),
     orderController.updateSingleOrderByAdmin)
  .delete(
    '/:id',
    // auth(USER_ROLE.ADMIN, USER_ROLE.SUB_ADMIN),
    orderController.deleteSingleOrder,
  );

export default orderRouter;
