import { Schema, model, modelNames } from "mongoose";

const MaterialSchema: Schema = new Schema({
  class: {
    type: String
  },
  subject: {
    type: String
  },
  topic: {
    type: Schema.Types.ObjectId,
    ref: "topic"
  },
  subTopic: {
    type: Schema.Types.ObjectId,
    ref: "subTopic"
  },
  fileURL: {
    type: String
  },
  materialName: {
    type: String
  },
  folderId: {
    type: Schema.Types.ObjectId,
    ref: "folder",
    required: true
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected", "active"]
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
  approvedBy: {
    type: Schema.Types.ObjectId,
    ref: "user"
  },
  deletedBy: {
    type: Schema.Types.ObjectId,
    ref: "user"
  }
});

export const MaterialModel = model("material", MaterialSchema);
