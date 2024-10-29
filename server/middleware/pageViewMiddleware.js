const PageView = require('../models/pageView');
const logger = require('../utils/logger');

/**
 * Middleware zum Zählen der Seitenaufrufe
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Next middleware function
 */
const trackPageView = async (req, res, next) => {
    try {
        // Hole oder erstelle den PageView-Eintrag
        let pageView = await PageView.findOne();
        if (!pageView) {
            pageView = new PageView();
        }

        // Erhöhe den Zähler und aktualisiere den Zeitstempel
        pageView.count += 1;
        pageView.lastUpdated = new Date();
        await pageView.save();

        logger.info(`Seitenaufruf gezählt. Neue Gesamtanzahl: ${pageView.count}`);
        next();
    } catch (error) {
        logger.error('Fehler beim Zählen des Seitenaufrufs:', error);
        next(error);
    }
};

/**
 * Controller zum Abrufen der Seitenaufrufe
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getPageViewCount = async (req, res) => {
    try {
        let pageView = await PageView.findOne();
        if (!pageView) {
            pageView = new PageView();
            await pageView.save();
        }

        res.json({ count: pageView.count });
    } catch (error) {
        logger.error('Fehler beim Abrufen der Seitenaufrufe:', error);
        res.status(500).json({ error: 'Fehler beim Abrufen der Seitenaufrufe' });
    }
};

module.exports = { trackPageView, getPageViewCount };