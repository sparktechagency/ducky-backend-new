import AppError from '../../error/AppError';
import { User } from '../user/user.models';
import QueryBuilder from '../../builder/QueryBuilder';
import { TWithdraw } from './withdraw.interface';
import { Withdraw } from './withdraw.model';
// import { Wallet } from '../wallet/wallet.model';

const addWithdrawService = async (payload: TWithdraw) => {
  const {
    businessId,
    amount,
    method
  } = payload;

  const business = await User.findById(businessId);
  if (!business) {
    throw new AppError(400, 'Business is not found!');
  }

  if (business.role !== 'user') {
    throw new AppError(400, 'User is not authorized as a Mentor!!');
  }

  // Validate Withdrawal Amount
  if (!amount || amount <= 0) {
    throw new AppError(
      400,
      'Invalid Withdrawal amount. It must be a positive number.',
    );
  }

  

  const result = await Withdraw.create(payload);

  return result;
};

const getAllWithdrawService = async (query: Record<string, unknown>) => {
  const WithdrawQuery = new QueryBuilder(
    Withdraw.find().populate('userId'),
    query,
  )
    .search(['name'])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await WithdrawQuery.modelQuery;
  const meta = await WithdrawQuery.countTotal();
  return { meta, result };
};

const getAllWithdrawBybusinessService = async (
  query: Record<string, unknown>,
  businessId: string,
) => {
  const WithdrawQuery = new QueryBuilder(Withdraw.find({ businessId }), query)
    .search(['name'])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await WithdrawQuery.modelQuery;
  const meta = await WithdrawQuery.countTotal();
  return { meta, result };
};

const singleWithdrawService = async (id: string) => {
  const task = await Withdraw.findById(id);
  return task;
};




const deleteSingleWithdrawService = async (id: string) => {
  const result = await Withdraw.deleteOne({ _id: id });
  return result;
};

export const withdrawService = {
  addWithdrawService,
  getAllWithdrawService,
  singleWithdrawService,
  getAllWithdrawBybusinessService,
  deleteSingleWithdrawService,
};
