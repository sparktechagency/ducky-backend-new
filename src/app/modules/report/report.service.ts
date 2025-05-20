import AppError from '../../error/AppError';
import httpStatus from 'http-status';
import QueryBuilder from '../../builder/QueryBuilder';
import { TReport } from './report.interface';
import Report from './report.model';

const createReport = async (payload: TReport) => {
  console.log('Report payload=', payload);

  const result = await Report.create(payload);

  if (!result) {
    throw new AppError(403, 'Report create faild!!');
  }

  return result;
};

const getAllReportQuery = async (query: Record<string, unknown>) => {
  const ReportQuery = new QueryBuilder(Report.find(), query)
    .search([])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await ReportQuery.modelQuery;

  const meta = await ReportQuery.countTotal();
  return { meta, result };
};



export const reportService = {
  createReport,
  getAllReportQuery,
};
