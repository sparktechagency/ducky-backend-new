import express from 'express';
import { cartController } from './cart.controller';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constants';

const cartRouter = express.Router();

cartRouter
  .post(
    '/create-cart',
    auth(USER_ROLE.USER),
    // validateRequest(videoValidation.VideoSchema),
    cartController.createCart,
  )
  .get('/', auth(USER_ROLE.USER), cartController.getAllCart)
  .patch(
    '/:id/quantity/:action',
    auth(USER_ROLE.USER),
    cartController.singleCartProductQuantityUpdate,
  )
  .delete('/:id', cartController.deleteSingleCart);

export default cartRouter;
