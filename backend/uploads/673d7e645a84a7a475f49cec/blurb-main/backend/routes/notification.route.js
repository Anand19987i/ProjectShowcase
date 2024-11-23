import express from "express"
import { getNotifications, markNotificationAsRead } from "../controllers/notification.controller.js"

const router = express.Router();

router.route("/b/notifications/:userId").get(getNotifications);
router.route("/b/notifications/markAsRead/:notificationId").post(markNotificationAsRead);

export default router;

