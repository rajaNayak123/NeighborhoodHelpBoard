import { Notification } from "../models/Notification.js";

const getNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({ user: req.user._id }).sort({
      createdAt: -1,
    });

    res.status(200).json(notifications);
  } catch (error) {
    next(error);
  }
};

const markAsRead = async (req, res, next) => {
  try {
    if (req.params.id) {
      // Mark a single notification as read
      await Notification.findOneAndUpdate(
        { _id: req.params.id, user: req.user._id },
        { isRead: true }
      );
    } else {
      // Mark all unread notifications as read
      await Notification.updateMany(
        { user: req.user._id, isRead: false },
        { isRead: true }
      );
    }
    res
      .status(200)
      .json({ success: true, message: "Notifications marked as read" });
  } catch (error) {
    next(error);
  }
};

export { 
    getNotifications, 
    markAsRead 
};