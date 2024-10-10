const Notification = require('../models/notification');
const logger = require('../utils/logger');

const getNotifications = async (req, res) => {
    const { userId } = req.params;
    try {
        const notifications = await Notification.find({
            userId,
            read: false,
        }).sort({
            createdAt: -1,
        });
        logger.info(
            `Fetched ${notifications.length} unread notifications for user ${userId}`
        );
        res.status(200).json(notifications);
    } catch (error) {
        logger.error('Error fetching notifications: ' + error);
        res.status(500).json({ error: 'Error fetching notifications' });
    }
};

const markNotificationAsRead = async (req, res) => {
    const { notificationId } = req.params;
    try {
        const notification = await Notification.findByIdAndUpdate(
            notificationId,
            { read: true },
            { new: true }
        );
        if (!notification) {
            return res.status(404).json({ error: 'Notification not found' });
        }
        logger.info(`Marked notification ${notificationId} as read`);
        res.status(200).json(notification);
    } catch (error) {
        logger.error('Error marking notification as read: ' + error);
        res.status(500).json({ error: 'Error marking notification as read' });
    }
};

module.exports = {
    getNotifications,
    markNotificationAsRead,
};
