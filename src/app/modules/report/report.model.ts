import { model, Schema } from "mongoose";
import { TReport } from "./report.interface";

const faqSchema = new Schema<TReport>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  text: {
    type: String,
    required: true,
  }
});

const Report = model<TReport>('Report', faqSchema);
export default Report;