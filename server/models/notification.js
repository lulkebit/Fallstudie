const mongoose = require('mongoose');

/**
 * Mongoose Schema für Benutzerbenachrichtigungen.
 * @typedef {Object} NotificationSchema
 * @property {mongoose.Schema.Types.ObjectId} userId - Die ID des Benutzers, der die Benachrichtigung erhalten soll.
 * @property {string} title - Der Titel der Benachrichtigung.
 * @property {string} message - Der Inhalt der Benachrichtigung.
 * @property {boolean} read - Gibt an, ob die Benachrichtigung gelesen wurde.
 * @property {Date} createdAt - Das Erstellungsdatum der Benachrichtigung.
 */

const notificationSchema = new mongoose.Schema({
    /**
     * Die ID des Benutzers, der die Benachrichtigung erhalten soll.
     * @type {mongoose.Schema.Types.ObjectId}
     * @required
     */
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },

    /**
     * Der Titel der Benachrichtigung.
     * @type {string}
     * @required
     */
    title: {
        type: String,
        required: true,
    },

    /**
     * Der Inhalt der Benachrichtigung.
     * @type {string}
     * @required
     */
    message: {
        type: String,
        required: true,
    },

    /**
     * Gibt an, ob die Benachrichtigung gelesen wurde.
     * @type {boolean}
     * @default false
     */
    read: {
        type: Boolean,
        default: false,
    },

    /**
     * Das Erstellungsdatum der Benachrichtigung.
     * @type {Date}
     * @default Date.now
     */
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Notification', notificationSchema);
