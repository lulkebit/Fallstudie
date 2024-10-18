const Notification = require('../models/notification');

/**
 * Erstellt und speichert eine neue Benachrichtigung für einen Benutzer.
 *
 * @param {string} userId - Die ID des Benutzers, der die Benachrichtigung erhalten soll.
 * @param {string} title - Der Titel der Benachrichtigung.
 * @param {string} message - Der Inhalt der Benachrichtigung.
 * @param {boolean} read - Der Lesestatus der Benachrichtigung (true für gelesen, false für ungelesen).
 * @returns {Promise<Object>} Ein Promise, das bei erfolgreicher Erstellung das gespeicherte Benachrichtigungsobjekt zurückgibt.
 * @throws {Error} Wenn ein Fehler beim Erstellen oder Speichern der Benachrichtigung auftritt.
 */
const sendNotification = async (userId, title, message, read) => {
    const notification = new Notification({
        userId,
        title,
        message,
        read,
    });
    await notification.save();
    return notification;
};

module.exports = { sendNotification };
