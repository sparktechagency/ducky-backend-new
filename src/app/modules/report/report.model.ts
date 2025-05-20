import { model, Schema } from "mongoose";
import { TReport } from "./report.interface";

const faqSchema = new Schema<TReport>({
  text: {
    type: String,
    required: true,
  }
});

const Report = model<TReport>('Report', faqSchema);
export default Report;