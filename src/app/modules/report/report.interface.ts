import { Types } from "mongoose";

export type TReport = {
  userId:Types.ObjectId;
  text: string;
};
