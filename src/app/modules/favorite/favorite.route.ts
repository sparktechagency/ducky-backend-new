import { Router } from 'express';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constants';
import { favoriteProductController } from './favorite.controller';

const favoriteProductRoutes = Router();

favoriteProductRoutes.post(
  '',
  auth(USER_ROLE.USER),
  //   validateRequest(paymnetValidation),
  favoriteProductController.createFavoriteProduct,
);

favoriteProductRoutes.get(
  '',
  auth(USER_ROLE.USER),
  favoriteProductController.getAllFavoriteProductByUser,
);
// saveStoryRoutes.delete(
//   '/:id',
//   auth(USER_ROLE.USER),
//   SaveStoryController.deletedSaveStory,
// );

export default favoriteProductRoutes;
