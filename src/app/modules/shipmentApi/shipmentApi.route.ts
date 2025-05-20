import express from 'express';
import { shippingController } from './shipmentApi.controller';

const shippingRouter = express.Router();

shippingRouter
  .post(
    '/create-shipping',
    // auth(USER_ROLE.USER),
    // validateRequest(videoValidation.VideoSchema),
    shippingController.createShipping,
  )
  .post(
    '/create-shipping-request/:id',
    // auth(USER_ROLE.USER),
    // validateRequest(videoValidation.VideoSchema),
    shippingController.createShippingRequest,
  )
  .post(
    '/rates',
    // auth(USER_ROLE.USER),
    // validateRequest(videoValidation.VideoSchema),
    shippingController.createShippingRates,
  )
  .get('/', shippingController.getAllShipping)
  .get('/request', shippingController.getAllShippingRequest)
  .get('/:id', shippingController.getSingleShipping)
  .delete('/:id', shippingController.deleteSingleShipping);

export default shippingRouter;
