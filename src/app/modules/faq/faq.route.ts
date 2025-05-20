import express from 'express';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constants';
import { faqController } from './faq.controller';

const faqRouter = express.Router();


faqRouter
  .post(
    '/create-faq',
    //  auth(USER_ROLE.ADMIN),
    faqController.createFaq,
  )
  .get(
    '/',
    //  auth(USER_ROLE.ADMIN),
    faqController.getAllFaq,
  )
  .get('/:id', faqController.getSingleFaq)
  .patch(
    '/:id',
    //  auth(USER_ROLE.ADMIN),
    faqController.updateSingleFaq,
  )
  .delete(
    '/:id',
    // auth(USER_ROLE.ADMIN, USER_ROLE.SUB_ADMIN),
    faqController.deleteSingleFaq,
  );

export default faqRouter;
