
import express from 'express';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constants';
import fileUpload from '../../middleware/fileUpload';
import { howMadeController } from './howMade.controller';

const howMadeRouter = express.Router();


const upload = fileUpload('./public/uploads/howMade');

howMadeRouter
  .post(
    '/create-made',
    //  auth(USER_ROLE.ADMIN),
    upload.fields([
      { name: 'image1', maxCount: 1 },
      { name: 'image2', maxCount: 1 },
      { name: 'video', maxCount: 1 },
    ]),
    howMadeController.createHowMade,
  )
  .get(
    '/',
    //  auth(USER_ROLE.ADMIN),
    howMadeController.getAllHowMade,
  )
  .get('/:id', howMadeController.getSingleHowMade)
  .patch(
    '/:id',
    upload.fields([
      { name: 'image1', maxCount: 1 },
      { name: 'image2', maxCount: 1 },
      { name: 'video', maxCount: 1 },
    ]),
    howMadeController.updateSingleHowMade,
  )
  .delete(
    '/:id',
    // auth(USER_ROLE.ADMIN, USER_ROLE.SUB_ADMIN),
    howMadeController.deleteSingleHowMade,
  );

export default howMadeRouter;
