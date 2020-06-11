import { Schema, model } from "mongoose";

const FolderSchema: Schema = new Schema({
  folderName: {
    type: String
  },
  type: {
    type: String,
    enum: ["material", "curriculum"],
    default: "material"
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "user"
  },
  updatedBy: {
    type: Schema.Types.ObjectId,
    ref: "user"
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date
  },
  createdIP: {
    type: String
  },
  updatedIP: {
    type: String
  }
});

export const FolderModel = model("folder", FolderSchema);
