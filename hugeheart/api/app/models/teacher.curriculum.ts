import { Schema, model } from "mongoose";

const TeacherCurriculumAssignSchema: Schema = new Schema({
  teacherId: {
    type: Schema.Types.ObjectId,
    ref: "user"
  },
  folderId: {
    type: Schema.Types.ObjectId,
    ref: "folder"
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

export const TeacherCurriculumAssignModel = model(
  "teacher_curriculum_assingment",
  TeacherCurriculumAssignSchema
);
