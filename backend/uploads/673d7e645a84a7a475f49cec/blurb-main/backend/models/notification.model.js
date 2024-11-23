import mongoose from "mongoose"

const notificationSchema = new mongoose.Schema({
    message: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    recipients: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref : 'User'
        }
    ],
    isRead: {
        type: Boolean,
        default: false
    }
})
export const Notification = mongoose.model('Notification', notificationSchema);