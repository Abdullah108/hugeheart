import { Schema, model } from "mongoose";

const AssignTaskToBrandSchema: Schema = new Schema({
  assignTask: {
    type: String
  },
  additionalNote: {
    type: String
  },
  assignDate: {
    type: Date
  },
  markAs: {
    type: String,
    enum: ["complete", "incomplete", "pending", "inprogress"]
  },
  markAsNote: {
    type: String
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "user"
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isDeleted: {
    type: Boolean,
    default: false
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

export const AssignTaskToBrand = model(
  "assignTaskToBrand",
  AssignTaskToBrandSchema
);
