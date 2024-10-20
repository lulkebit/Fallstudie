const mongoose = require('mongoose');
const { Schema } = mongoose;

/**
 * Schema für globale Ziele.
 * @typedef {Object} GlobalGoal
 * @property {mongoose.Schema.Types.ObjectId} id - Die eindeutige ID des globalen Ziels.
 * @property {string} title - Der Titel des globalen Ziels.
 * @property {string} description - Eine Beschreibung des globalen Ziels.
 * @property {Date} startDate - Das Startdatum des globalen Ziels.
 * @property {Date} endDate - Das Enddatum des globalen Ziels.
 * @property {number} targetValue - Der Zielwert des globalen Ziels.
 * @property {string} unit - Die Einheit des Zielwerts.
 * @property {number} currentValue - Der aktuelle Wert des Fortschritts.
 * @property {number} participationCount - Anzahl an Teilnehmer
 */

const globalGoalSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    targetValue: { type: Number, required: true },
    currentValue: { type: Number, default: 0 },
    unit: { type: String, required: true },
    participationCount: { type: Number, default: 0 },
});

const GlobalGoalModel = mongoose.model('GlobalGoal', globalGoalSchema);

module.exports = GlobalGoalModel;
