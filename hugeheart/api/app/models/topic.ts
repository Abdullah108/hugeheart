import { Schema, model } from 'mongoose';

const TopicSchema: Schema = new Schema({
    name: {
        type: String
    },
    isActive: {
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
    }
});

export const TopicModel = model("topic", TopicSchema);