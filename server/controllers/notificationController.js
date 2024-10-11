const Notification = require('../models/notification');
const logger = require('../utils/logger');
const texts = require('../ressources/texts');

const getNotifications = async (req, res) => {
    const { userId } = req.params;
    try {
        const notifications = await Notification.find({
            userId,
            read: false,
        }).sort({
            createdAt: -1,
        });

        res.status(200).json(notifications);
    } catch (error) {
        logger.error(texts.ERRORS.ERROR('fetching notifications', error));
        res.status(500).json({ error: texts.ERRORS.FETCH_NOTIFICATIONS });
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
            return res
                .status(404)
                .json({ error: texts.ERRORS.NOTIFICATION_NOT_FOUND });
        }
        logger.info(texts.INFO.NOTIFICATION_MARKED_READ(notificationId));
        res.status(200).json(notification);
    } catch (error) {
        logger.error(texts.ERRORS.ERROR('marking notification as read', error));
        res.status(500).json({ error: texts.ERRORS.MARK_NOTIFICATION_READ });
    }
};

const getAllNotifications = async (req, res) => {
    const { userId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const skip = (page - 1) * limit;

    logger.info(texts.INFO.FETCHING_NOTIFICATIONS(userId, page, limit));

    try {
        const notifications = await Notification.find({ userId })
            .sort({ createdAt: -1 })
            .limit(parseInt(limit))
            .skip(parseInt(skip));

        const totalNotifications = await Notification.countDocuments({
            userId,
        });

        res.status(200).json({
            notifications,
            totalPages: Math.ceil(totalNotifications / limit),
            currentPage: parseInt(page),
        });
    } catch (error) {
        logger.error(texts.ERRORS.ERROR('fetching notifications', error));
        res.status(500).json({ error: texts.ERRORS.FETCH_NOTIFICATIONS });
    }
};

module.exports = {
    getNotifications,
    markNotificationAsRead,
    getAllNotifications,
};
