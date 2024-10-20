const mongoose = require('mongoose');
const { Schema } = mongoose;

/**
 * Mongoose Schema für Benutzer.
 * @typedef {Object} UserSchema
 * @property {string} username - Der eindeutige Benutzername.
 * @property {string} email - Die eindeutige E-Mail-Adresse des Benutzers.
 * @property {string} password - Das Passwort des Benutzers (sollte verschlüsselt gespeichert werden).
 * @property {string} firstname - Der Vorname des Benutzers.
 * @property {string} lastname - Der Nachname des Benutzers.
 * @property {Array<Goal>} goals - Die Liste der Ziele des Benutzers.
 * @property {string} avatar - Der Avatar des Benutzers (z.B. ein Bild-URL oder Base64-kodiertes Bild).
 * @property {Array<mongoose.Schema.Types.ObjectId>} friends - Die Liste der Freunde des Benutzers.
 * @property {Array<PinnedFriendGoal>} pinnedFriendGoals - Die Liste der angepinnten Ziele von Freunden.
 */

/**
 * Schema für ein einzelnes Ziel.
 * @typedef {Object} Goal
 * @property {number} id - Die eindeutige ID des Ziels.
 * @property {string} title - Der Titel des Ziels.
 * @property {string} category - Die Kategorie des Ziels.
 * @property {Date} startDate - Das Startdatum des Ziels.
 * @property {Date} endDate - Das Enddatum des Ziels.
 * @property {boolean} public - Gibt an, ob das Ziel öffentlich ist.
 * @property {number} targetValue - Der Zielwert.
 * @property {string} unit - Die Einheit des Ziels.
 * @property {string} direction - Die Richtung des Ziels (z.B. "increase" oder "decrease").
 * @property {number} reminderInterval - Das Intervall für Erinnerungen.
 * @property {string} reminderType - Der Typ der Erinnerung.
 * @property {number} progress - Der aktuelle Fortschritt des Ziels.
 * @property {string} description - Eine Beschreibung des Ziels.
 * @property {boolean} isPinned - Gibt an, ob das Ziel angepinnt ist.
 */

/**
 * Schema für ein angepinntes Ziel eines Freundes.
 * @typedef {Object} PinnedFriendGoal
 * @property {mongoose.Schema.Types.ObjectId} friendId - Die ID des Freundes.
 * @property {number} goalId - Die ID des angepinnten Ziels.
 */

const userSchema = new Schema({
    /**
     * Ist der Benutzer ein Administrator?
     * @type {boolean}
     * @default false
     */
    isAdmin: { type: Boolean, default: false },

    /**
     * Der eindeutige Benutzername.
     * @type {string}
     * @unique
     */
    username: {
        type: String,
        unique: true,
    },

    /**
     * Die eindeutige E-Mail-Adresse des Benutzers.
     * @type {string}
     * @unique
     */
    email: {
        type: String,
        unique: true,
    },

    /**
     * Das Passwort des Benutzers (sollte verschlüsselt gespeichert werden).
     * @type {string}
     */
    password: String,

    /**
     * Der Vorname des Benutzers.
     * @type {string}
     */
    firstname: String,

    /**
     * Der Nachname des Benutzers.
     * @type {string}
     */
    lastname: String,

    /**
     * Die Liste der Ziele des Benutzers.
     * @type {Array<Goal>}
     */
    goals: [
        {
            id: Number,
            title: String,
            category: String,
            startDate: Date,
            endDate: Date,
            public: Boolean,
            targetValue: Number,
            unit: String,
            direction: String,
            reminderInterval: Number,
            reminderType: String,
            progress: Number,
            description: String,
            isPinned: { type: Boolean, default: false },
        },
    ],

    /**
     * Der Avatar des Benutzers (z.B. ein Bild-URL oder Base64-kodiertes Bild).
     * @type {string}
     */
    avatar: {
        type: String,
    },

    /**
     * Die Liste der Freunde des Benutzers.
     * @type {Array<mongoose.Schema.Types.ObjectId>}
     */
    friends: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
    ],

    /**
     * Die Liste der angepinnten Ziele von Freunden.
     * @type {Array<PinnedFriendGoal>}
     */
    pinnedFriendGoals: [
        {
            friendId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
            goalId: Number,
        },
    ],
});

const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;
