import { model, Schema } from "mongoose";
import { TFaq } from "./faq.interface";

const faqSchema = new Schema<TFaq>({
    question:{
        type:String,
        required:true
    },
    answer:{
        type:String,
        required:true
    }
});

const FAQ = model<TFaq>('FAQ', faqSchema);
export default FAQ;