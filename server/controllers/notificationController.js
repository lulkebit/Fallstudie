const Notification = require('../models/notification');
const logger = require('../utils/logger');

const getNotifications = async (req, res) => {
    const { userId } = req.params;
    try {
        const notifications = await Notification.find({ userId }).sort({
            createdAt: -1,
        });
        logger.info(
            `Fetched ${notifications.length} notifications for user ${userId}`
        );
        res.status(200).json(notifications);
    } catch (error) {
        logger.error('Error fetching notifications: ' + error);
        res.status(500).json({ error: 'Error fetching notifications' });
    }
};

module.exports = {
    getNotifications,
};
