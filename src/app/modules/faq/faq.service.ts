import AppError from '../../error/AppError';
import httpStatus from 'http-status';
import QueryBuilder from '../../builder/QueryBuilder';
import { TFaq } from './faq.interface';
import FAQ from './faq.model';

const createFaq = async (payload: TFaq) => {
  console.log('FAQ payload=', payload);

  const result = await FAQ.create(payload);

  if (!result) {
    throw new AppError(403, 'FAQ create faild!!');
  }

  return result;
};

const getAllFaqQuery = async (query: Record<string, unknown>) => {
  const faqQuery = new QueryBuilder(FAQ.find(), query)
    .search([])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await faqQuery.modelQuery;

  const meta = await faqQuery.countTotal();
  return { meta, result };
};

const getSingleFaqQuery = async (id: string) => {
  const faq: any = await FAQ.findById(id);
  if (!faq) {
    throw new AppError(404, 'Faq Not Found!!');
  }
  return faq;
};

const updateSingleFaqQuery = async (id: string, payload: any) => {
  console.log('id', id);
  console.log('updated payload', payload);
  const faqProduct: any = await FAQ.findById(id);
  if (!faqProduct) {
    throw new AppError(404, 'Faq is not found!');
  }

  const result = await FAQ.findByIdAndUpdate(id, payload, { new: true });

  if (!result) {
    throw new AppError(403, 'Faq updated faild!!');
  }

  return result;
};

const deletedFaqQuery = async (id: string) => {
  if (!id) {
    throw new AppError(400, 'Invalid input parameters');
  }
  const faq = await FAQ.findById(id);
  if (!faq) {
    throw new AppError(404, 'Faq Not Found!!');
  }

  const result = await FAQ.findByIdAndDelete(id);
  if (!result) {
    throw new AppError(404, 'Faq Result Not Found !');
  }

  return result;
};

export const faqService = {
  createFaq,
  getAllFaqQuery,
  getSingleFaqQuery,
  updateSingleFaqQuery,
  deletedFaqQuery,
};
