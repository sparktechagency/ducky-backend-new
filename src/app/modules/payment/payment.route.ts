import express from 'express';
import { paymentController } from './payment.controller';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constants';

// import { auth } from "../../middlewares/auth.js";

const paymentRouter = express.Router();

paymentRouter
  .post('/add-payment', auth(USER_ROLE.USER), paymentController.addPayment)

  .get('/success', paymentController.successPage)
  .get('/cancel', paymentController.cancelPage)

  .get('/', 
    // auth(USER_ROLE.ADMIN), 
    paymentController.getAllPayment)
  .get('/all-income-rasio', paymentController.getAllIncomeRasio)
  .get('/all-income-rasio-by-days', paymentController.getAllIncomeRasioBydays)
  .get(
    '/all-earning-rasio',     
    auth(USER_ROLE.ADMIN),
    paymentController.getAllEarningRasio,
  )

  .get('/:id', paymentController.getSinglePayment)

  .delete('/:id', paymentController.deleteSinglePayment);

export default paymentRouter;











