import { Schema, model } from "mongoose";

const PrincipleSchema: Schema = new Schema({
  // question: {
  //     type: String
  // },
  answer: {
    type: String
  },
  documents: {
    type: String
  },
  userId: [
    {
      type: Schema.Types.ObjectId,
      ref: "user"
    }
  ],
  userRole: {
    type: [String],
    enum: ["superadmin", "masteradmin", "teacher", "student", "brandamb"]
  },
  type: {
    type: String,
    enum: ["marketmaterial", "principle"]
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

export const PrincipleModel = model("principle", PrincipleSchema);
