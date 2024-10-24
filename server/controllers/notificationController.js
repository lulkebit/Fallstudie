const Notification = require('../models/notification');
const logger = require('../utils/logger');

/**
 * Ruft alle ungelesenen Benachrichtigungen für einen Benutzer ab.
 *
 * @param {Object} req - Das Express-Request-Objekt.
 * @param {Object} req.params - Die Parameter der Anfrage.
 * @param {string} req.params.userId - Die ID des Benutzers.
 * @param {Object} res - Das Express-Response-Objekt.
 * @returns {Promise<Array>} Ein Promise, das bei Erfolg ein Array aller ungelesenen Benachrichtigungen zurückgibt.
 * @throws {Object} Bei Fehlern während des Abrufens wird ein Fehler-Objekt zurückgegeben.
 */
const getNotifications = async (req, res) => {
    const { userId } = req.params;
    try {
        const notifications = await Notification.find({
            userId,
            read: false,
        }).sort({
            createdAt: -1,
        });

        // Format dates for frontend
        const formattedNotifications = notifications.map((notification) => ({
            ...notification.toObject(),
            formattedDate: new Date(notification.createdAt).toLocaleString(
                'de-DE',
                {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                }
            ),
        }));

        res.status(200).json(formattedNotifications);
    } catch (error) {
        logger.error('Error fetching notifications:', error);
        res.status(500).json({ error: 'Error fetching notifications' });
    }
};

/**
 * Ruft alle Benachrichtigungen für einen Benutzer ab, mit Pagination.
 *
 * @param {Object} req - Das Express-Request-Objekt.
 * @param {Object} req.params - Die Parameter der Anfrage.
 * @param {string} req.params.userId - Die ID des Benutzers.
 * @param {Object} req.query - Die Query-Parameter der Anfrage.
 * @param {number} [req.query.page=1] - Die Seitennummer für die Pagination.
 * @param {number} [req.query.limit=10] - Die Anzahl der Benachrichtigungen pro Seite.
 * @param {Object} res - Das Express-Response-Objekt.
 * @returns {Promise<Object>} Ein Promise, das bei Erfolg ein Objekt mit Benachrichtigungen und Metadaten zurückgibt.
 * @throws {Object} Bei Fehlern während des Abrufens wird ein Fehler-Objekt zurückgegeben.
 */
const getAllNotifications = async (req, res) => {
    const { userId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    try {
        const skip = (page - 1) * limit;

        const notifications = await Notification.find({ userId })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const totalNotifications = await Notification.countDocuments({
            userId,
        });

        // Format dates for frontend
        const formattedNotifications = notifications.map((notification) => ({
            ...notification.toObject(),
            formattedDate: new Date(notification.createdAt).toLocaleString(
                'de-DE',
                {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                }
            ),
        }));

        res.status(200).json({
            notifications: formattedNotifications,
            totalPages: Math.ceil(totalNotifications / limit),
            currentPage: parseInt(page),
        });
    } catch (error) {
        logger.error('Error fetching all notifications:', error);
        res.status(500).json({ error: 'Error fetching all notifications' });
    }
};

/**
 * Markiert eine Benachrichtigung als gelesen.
 *
 * @param {Object} req - Das Express-Request-Objekt.
 * @param {Object} req.params - Die Parameter der Anfrage.
 * @param {string} req.params.notificationId - Die ID der zu markierenden Benachrichtigung.
 * @param {Object} res - Das Express-Response-Objekt.
 * @returns {Promise<Object>} Ein Promise, das bei Erfolg die aktualisierte Benachrichtigung zurückgibt.
 * @throws {Object} Bei Fehlern während der Aktualisierung wird ein Fehler-Objekt zurückgegeben.
 */
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

        res.status(200).json(notification);
    } catch (error) {
        logger.error('Error marking notification as read:', error);
        res.status(500).json({ error: 'Error marking notification as read' });
    }
};

/**
 * Markiert alle ungelesenen Benachrichtigungen eines Benutzers als gelesen.
 *
 * @param {Object} req - Das Express-Request-Objekt.
 * @param {Object} req.params - Die Parameter der Anfrage.
 * @param {string} req.params.userId - Die ID des Benutzers.
 * @param {Object} res - Das Express-Response-Objekt.
 * @returns {Promise<Object>} Ein Promise, das bei Erfolg die Anzahl der aktualisierten Benachrichtigungen zurückgibt.
 * @throws {Object} Bei Fehlern während der Aktualisierung wird ein Fehler-Objekt zurückgegeben.
 */
const markAllNotificationsAsRead = async (req, res) => {
    const { userId } = req.params;
    try {
        const result = await Notification.updateMany(
            { userId, read: false },
            { read: true }
        );

        res.status(200).json({
            message: 'All notifications marked as read',
            modifiedCount: result.modifiedCount,
        });
    } catch (error) {
        logger.error('Error marking all notifications as read:', error);
        res.status(500).json({
            error: 'Error marking all notifications as read',
        });
    }
};

module.exports = {
    getNotifications,
    getAllNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
};
