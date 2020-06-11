import { Schema, model } from "mongoose";

const PriceGuideSchema: Schema = new Schema({
  class: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  group: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
  updatedBy: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
});

export const PriceGuideModel = model("price_guide", PriceGuideSchema);
