import { Schema, model, modelNames } from "mongoose";

const CurriculumSchema: Schema = new Schema({
  class: {
    type: String
  },
  subject: {
    type: String
  },
  country: {
    type: String
  },
  state: {
    type: String
  },
  fileURL: {
    type: String
  },
  curriculumName: {
    type: String
  },
  folderId: {
    type: Schema.Types.ObjectId,
    ref: "folder",
    required: true
  },
  isActive: {
    type: Boolean
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
  }
});

export const CurriculumModel = model("curriculum", CurriculumSchema);
