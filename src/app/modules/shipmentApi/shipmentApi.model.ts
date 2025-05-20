import { model, Schema } from "mongoose";
import { TShipmentApi, TShipmentRequestApi } from "./shipmentApi.interface";

const shipmentApiSchema = new Schema<TShipmentApi>({
    shippingbookingId: { type: String, required: true }
  });



const ShipmentApi = model<TShipmentApi>('ShipmentApi', shipmentApiSchema);
// export default ShipmentApi;


const shipmentRequestSchema = new Schema<TShipmentRequestApi>({
  shipmentRequestId: { type: String, required: true , unique: true },
},{timestamps: true});



const ShipmentRequestApi = model<TShipmentRequestApi>(
  'ShipmentRequestApi',
  shipmentRequestSchema,
);
// export default ShipmentRequestApi;
export  { ShipmentApi, ShipmentRequestApi} ;