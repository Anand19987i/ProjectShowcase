import { Notification } from "../models/notification.model.js";

export const getNotifications = async (req, res) => {
    const { userId } = req.params;

    try {
        // Find notifications for the given user
        const notifications = await Notification.find({ recipients: userId })
            .sort({ createdAt: -1 }) // Sort by most recent
            .select('-recipients');  // Exclude recipients field for privacy

        if (!notifications || notifications.length === 0) {
            return res.status(404).json({
                message: "No notifications found.",
                success: false,
            });
        }

        return res.status(200).json({
            message: "Notifications fetched successfully.",
            success: true,
            notifications,
        });
    } catch (error) {
        console.error("Error fetching notifications:", error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
        });
    }
};
// Mark a single notification as read
export const markNotificationAsRead = async (req, res) => {
    const { notificationId } = req.params; // Get notificationId from request params

    try {
        const notification = await Notification.findByIdAndUpdate(
            notificationId,
            { isRead: true },
            { new: true } // Return the updated notification
        );

        if (!notification) {
            return res.status(404).json({
                message: "Notification not found.",
                success: false,
            });
        }

        return res.status(200).json({
            message: "Notification marked as read.",
            success: true,
            notification,
        });
    } catch (error) {
        console.error("Error marking notification as read:", error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
        });
    }
};
