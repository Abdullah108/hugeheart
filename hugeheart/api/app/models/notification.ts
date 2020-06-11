import { Schema, model } from "mongoose";

const NotificationSchema: Schema = new Schema({
    title: {
        type: String
    },
    content: {
        type: String
    },
    url:{
        type: String
    },
    isRead: {
        type: Boolean,
        default: false
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    createdFor: [{
        type: Schema.Types.ObjectId,
        ref: "user"
    }],
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
});

export const NotificationModel = model("notification", NotificationSchema);
