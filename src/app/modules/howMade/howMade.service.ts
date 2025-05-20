import AppError from '../../error/AppError';
import httpStatus from 'http-status';
import QueryBuilder from '../../builder/QueryBuilder';
import HowMade from './howMade.model';
import { THowMade } from './howMade.interface';

const createHowMade = async (payload:THowMade) => {

    console.log('how made payload=', payload);

    const result = await HowMade.create(payload);

    if (!result) {
        throw new AppError(403, "How made create faild!!");
    }

    return result;
  
};

const getAllHowMadeQuery = async (query: Record<string, unknown>) => {
  const howMadeQuery = new QueryBuilder(
    HowMade.find(),
    query,
  )
    .search([])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await howMadeQuery.modelQuery;

  const meta = await howMadeQuery.countTotal();
  return { meta, result };
};



const getSingleHowMadeQuery = async (id: string) => {
  const howMade: any = await HowMade.findById(id);
  if (!howMade) {
    throw new AppError(404, 'HowMade Not Found!!');
  }
  return howMade;
};

const updateSingleHowMadeStatusQuery = async (id: string, payload: any) => {
  console.log('id', id);
  console.log('updated payload', payload);
  const HowMadeProduct: any = await HowMade.findById(id);
  if (!HowMadeProduct) {
    throw new AppError(404, 'HowMade Product is not found!');
  }



  const result = await HowMade.findByIdAndUpdate(id, payload, {new:true})

  if(!result){
    throw new AppError(403, "Ducky made updated faild!!");
  }

  
  return result;
};

const deletedHowMadeQuery = async (id: string) => {
  if (!id) {
    throw new AppError(400, 'Invalid input parameters');
  }
  const howMade = await HowMade.findById(id);
  if (!howMade) {
    throw new AppError(404, 'HowMade Not Found!!');
  }

  const result = await HowMade.findByIdAndDelete(id);
  if (!result) {
    throw new AppError(404, 'HowMade Result Not Found !');
  }

  return result;
};

export const howMadeService = {
    createHowMade,
  getAllHowMadeQuery,
  getSingleHowMadeQuery,
  updateSingleHowMadeStatusQuery,
  deletedHowMadeQuery,
};
