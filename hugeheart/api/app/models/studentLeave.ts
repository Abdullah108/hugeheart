import { Schema, model } from 'mongoose';

const StudentLeaveSchema: Schema = new Schema({
    adminId: {
        type: Schema.Types.ObjectId,
        ref: "user"
    },
    masterAdminId: {
        type: Schema.Types.ObjectId,
        ref: "user"
    },
    message: {
        type: String
    },
    date: {
        type: Date
    },
    status: {
        type: String,
        enum: ["not requested", "requested", "accepted", "rejected"],
        default: "not requested"
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date
    }
})


export const StudentLeaveModel = model("studentLeave", StudentLeaveSchema);