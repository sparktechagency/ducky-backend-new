// /* eslint-disable prefer-const */
// import { Shop } from '../shop/shop.models';

// export const findLastShopId = async () => {
//   const lastShop = await Shop.findOne({}, { id: 1, _id: 0 })
//     .sort({ createdAt: -1 })
//     .lean();
//   return lastShop?.id;
// };

// export const generateShopId = async () => {
//   const currentId = (await findLastShopId()) || (0).toString().padStart(5, '0');
//   let incrementedId = (parseInt(currentId) + 1).toString().padStart(5, '0');

//   return incrementedId;
// };
