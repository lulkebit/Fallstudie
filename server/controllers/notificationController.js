const Notification = require('../models/notification');
const logger = require('../utils/logger');
const texts = require('../ressources/texts');

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

        res.status(200).json(notifications);
    } catch (error) {
        logger.error(texts.ERRORS.ERROR('fetching notifications', error));
        res.status(500).json({ error: texts.ERRORS.FETCH_NOTIFICATIONS });
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
 * @returns {Promise<Object>} Ein Promise, das bei Erfolg ein Objekt mit Benachrichtigungen, Gesamtseitenzahl und aktueller Seite zurückgibt.
 * @throws {Object} Bei Fehlern während des Abrufens wird ein Fehler-Objekt zurückgegeben.
 */
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
