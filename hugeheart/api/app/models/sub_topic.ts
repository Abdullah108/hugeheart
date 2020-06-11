import { Schema, model } from 'mongoose';

const SubTopicSchema: Schema = new Schema({
    topicId: {
        type: Schema.Types.ObjectId
    },
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

export const SubTopicModel = model('subTopic', SubTopicSchema);