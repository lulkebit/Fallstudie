const mongoose = require('mongoose');

/**
 * Mongoose Schema für die Freundschaftsbeziehungen zwischen Benutzern.
 * @typedef {Object} FriendSchema
 * @property {mongoose.Schema.Types.ObjectId} userId - Die ID des Benutzers, der die Freundschaftsanfrage gesendet hat.
 * @property {mongoose.Schema.Types.ObjectId} friendId - Die ID des Benutzers, an den die Freundschaftsanfrage gesendet wurde.
 * @property {string} status - Der Status der Freundschaftsanfrage. Mögliche Werte sind 'pending', 'accepted' oder 'declined'.
 * @property {mongoose.Schema.Types.ObjectId} [notificationId] - Die ID der zugehörigen Benachrichtigung (optional).
 * @property {Date} createdAt - Das Datum, an dem die Freundschaftsanfrage erstellt wurde.
 */

const friendSchema = new mongoose.Schema({
    /**
     * Die ID des Benutzers, der die Freundschaftsanfrage gesendet hat.
     * @type {mongoose.Schema.Types.ObjectId}
     * @required
     */
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },

    /**
     * Die ID des Benutzers, an den die Freundschaftsanfrage gesendet wurde.
     * @type {mongoose.Schema.Types.ObjectId}
     * @required
     */
    friendId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },

    /**
     * Der Status der Freundschaftsanfrage.
     * @type {string}
     * @enum {string}
     * @default 'pending'
     */
    status: {
        type: String,
        enum: ['pending', 'accepted', 'declined'],
        default: 'pending',
    },

    /**
     * Die ID der zugehörigen Benachrichtigung (optional).
     * @type {mongoose.Schema.Types.ObjectId}
     */
    notificationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Notification',
    },

    /**
     * Das Datum, an dem die Freundschaftsanfrage erstellt wurde.
     * @type {Date}
     * @default Date.now
     */
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Friend', friendSchema);
