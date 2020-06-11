import { Schema, model } from "mongoose";

const MessageSchema: Schema = new Schema({
  message: {
    type: String
  },
  senderId: {
    type: Schema.Types.ObjectId,
    ref: "user"
  },
  recieverIds: [
    {
      type: Schema.Types.ObjectId,
      ref: "user"
    }
  ],
  attachement: {
    type: String
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
  }
});

export const MessageModel = model("message", MessageSchema);
