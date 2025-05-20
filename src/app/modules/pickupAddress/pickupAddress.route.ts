import express from 'express';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constants';
import { pickupAddressController } from './pickupAddress.controller';

const pickupAddressRouter = express.Router();

pickupAddressRouter
  .post(
    '/create-pickup-address',
    // auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
    pickupAddressController.addPickupAddress,
  )
  .get('/', pickupAddressController.getPickupAddresss)
  .patch('/', pickupAddressController.updatePickupAddress);

export default pickupAddressRouter;
