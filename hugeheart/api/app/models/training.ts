import { Schema, model } from "mongoose";

const TrainigSchema: Schema = new Schema({
  scheduleDate: {
    type: Date
  },
  trainingTitle: {
    type: String
  },
  trainingDescription: {
    type: String
  },
  userIds: [
    {
      type: Schema.Types.ObjectId,
      ref: "user"
    }
  ],
  trainingFor: {
    type: String,
    enum: ["teacher", "ba"]
  },
  status: {
    type: String,
    enum: ["completed", "awaiting", "postpone"],
    default: "awaiting"
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "user"
  },
  updatedBy: {
    type: Schema.Types.ObjectId,
    ref: "user"
  }
});

export const TrainingModel = model("training", TrainigSchema);
