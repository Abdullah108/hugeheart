import { Schema, model } from "mongoose";

const ScheduleModelSchema: Schema = new Schema({
  teacherId: {
    type: Schema.Types.ObjectId,
    ref: "user"
  },
  studentId: {
    type: Schema.Types.ObjectId,
    ref: "user"
  },
  leaveStatus: {
    type: String,
    enum: ["not requested", "requested", "accepted", "rejected"],
    default: "not requested"
  },
  note: {
    type: String
  },
  date: {
    type: Date
  },
  startDateTime: {
    type: Date
  },
  endDateTime: {
    type: Date
  },
  isCompleted: {
    type: Boolean,
    default: false
  },
  isTrialClass: {
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
  feedbacks: {
    type: [
      new Schema({
        text: String,
        createdBy: {
          type: Schema.Types.ObjectId,
          ref: "user"
        },
        userRole: {
          type: String,
          enum: ["student", "teacher"]
        }
      })
    ]
  },
  default: []
});

export const TeacherScheduleModel = model(
  "teacher_schedule",
  ScheduleModelSchema
);
