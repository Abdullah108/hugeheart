import { Schema, model } from "mongoose";

const AssignmentSchema: Schema = new Schema({
  teacherId: {
    type: Schema.Types.ObjectId,
    ref: "user"
  },
  masterAdminId: {
    type: Schema.Types.ObjectId,
    ref: "user"
  },
  assignmentStatus: {
    type: String,
    enum: ["assigned", "unassigned"],
    default: "assigned"
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

export const AssignmentModel = model(
  "teacher_master_assingment",
  AssignmentSchema
);
