import { Schema, model } from "mongoose";

const LoginArchiveSchema: Schema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
  loginAt: {
    type: Date,
    default: Date.now,
  },
  logoutAt: {
    type: Date,
  },
  loginIP: {
    type: String,
  },
});

export const LoginArchiveModel = model("login_archive", LoginArchiveSchema);
