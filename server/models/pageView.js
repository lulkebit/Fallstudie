const mongoose = require('mongoose');
const { Schema } = mongoose;

/**
 * Mongoose Schema für Seitenaufrufe.
 * @typedef {Object} PageViewSchema
 * @property {number} count - Die Gesamtanzahl der Seitenaufrufe.
 * @property {Date} lastUpdated - Zeitpunkt des letzten Aufrufs.
 */
const pageViewSchema = new Schema({
    count: {
        type: Number,
        default: 0
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    }
});

const PageViewModel = mongoose.model('PageView', pageViewSchema);

module.exports = PageViewModel;
