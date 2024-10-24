const Notification = require('../models/notification');
const logger = require('../utils/logger');

/**
 * Erstellt eine neue Benachrichtigung für einen Benutzer.
 *
 * @param {Object} notificationData - Die Daten für die neue Benachrichtigung.
 * @param {string} notificationData.userId - Die ID des Benutzers.
 * @param {string} notificationData.title - Der Titel der Benachrichtigung.
 * @param {string} notificationData.message - Die Nachricht der Benachrichtigung.
 * @param {string} [notificationData.link] - Optional: Der Link zu dem die Benachrichtigung führen soll.
 * @returns {Promise<Object>} Die erstellte Benachrichtigung.
 */
const createNotification = async ({ userId, title, message, link = null }) => {
    try {
        const notification = new Notification({
            userId,
            title,
            message,
            link,
        });
        await notification.save();
        logger.info(`Notification created for user ${userId}`);
        return notification;
    } catch (error) {
        logger.error('Error creating notification:', error);
        throw error;
    }
};

/**
 * Erstellt und speichert eine neue Benachrichtigung für einen Benutzer.
 * Legacy-Funktion für Abwärtskompatibilität.
 *
 * @param {string} userId - Die ID des Benutzers, der die Benachrichtigung erhalten soll.
 * @param {string} title - Der Titel der Benachrichtigung.
 * @param {string} message - Der Inhalt der Benachrichtigung.
 * @param {boolean} read - Der Lesestatus der Benachrichtigung.
 * @param {string} [link] - Optional: Der Link zu dem die Benachrichtigung führen soll.
 * @returns {Promise<Object>} Ein Promise, das bei erfolgreicher Erstellung das gespeicherte Benachrichtigungsobjekt zurückgibt.
 */
const sendNotification = async (
    userId,
    title,
    message,
    read = false,
    link = null
) => {
    return createNotification({
        userId,
        title,
        message,
        link,
        read,
    });
};

module.exports = {
    createNotification,
    sendNotification,
};
