const GlobalGoalModel = require('../models/globalGoal');
const logger = require('../utils/logger');

/**
 * Fügt ein neues globales Ziel hinzu.
 * @param {Object} req - Das Express-Request-Objekt.
 * @param {Object} res - Das Express-Response-Objekt.
 */
const addGlobalGoal = async (req, res) => {
    try {
        const newGoal = new GlobalGoalModel(req.body);
        await newGoal.save();
        logger.info(`Neues globales Ziel hinzugefügt: ${newGoal.title}`);
        res.status(201).json(newGoal);
    } catch (error) {
        logger.error(
            `Fehler beim Hinzufügen des globalen Ziels: ${error.message}`
        );
        res.status(500).json({ 
            error: 'Fehler beim Hinzufügen des globalen Ziels', 
        });
    }
};

/**
 * Ruft alle globalen Ziele ab.
 * @param {Object} req - Das Express-Request-Objekt.
 * @param {Object} res - Das Express-Response-Objekt.
 */
const getGlobalGoals = async (req, res) => {
    try {
        const goals = await GlobalGoalModel.find();
        res.status(200).json(goals);
    } catch (error) {
        logger.error(
            `Fehler beim Abrufen der globalen Ziele: ${error.message}`
        );
        res.status(500).json({
            error: 'Fehler beim Abrufen der globalen Ziele',
        });
    }
};

/**
 * Aktualisiert ein globales Ziel.
 * @param {Object} req - Das Express-Request-Objekt.
 * @param {Object} res - Das Express-Response-Objekt.
 */
const updateGlobalGoal = async (req, res) => {
    try {
        const { id, ...updateData } = req.body;
        const updatedGoal = await GlobalGoalModel.findByIdAndUpdate(
            id, 
            updateData, 
            { new: true }
        );
        if (!updatedGoal) {
            return res
            .status(404)
            .json({ error: 'Globales Ziel nicht gefunden' });
        }
        logger.info(`Globales Ziel aktualisiert: ${updatedGoal.title}`);
        res.status(200).json(updatedGoal);
    } catch (error) {
        logger.error(
            `Fehler beim Aktualisieren des globalen Ziels: ${error.message}`
        );
        res.status(500).json({
             error: 'Fehler beim Aktualisieren des globalen Ziels',
             });
    }
};

/**
 * Löscht ein globales Ziel.
 * @param {Object} req - Das Express-Request-Objekt.
 * @param {Object} res - Das Express-Response-Objekt.
 */
const deleteGlobalGoal = async (req, res) => {
    try {
        const deletedGoal = await GlobalGoalModel.findByIdAndDelete(
            req.params.id
        );
        if (!deletedGoal) {
            return res
                .status(404)
                .json({ error: 'Globales Ziel nicht gefunden' });
        }
        logger.info(`Globales Ziel gelöscht: ${deletedGoal.title}`);
        res.status(200).json({ message: 'Globales Ziel erfolgreich gelöscht' });
    } catch (error) {
        logger.error(
            `Fehler beim Löschen des globalen Ziels: ${error.message}`
        );
        res.status(500).json({
            error: 'Fehler beim Löschen des globalen Ziels',
        });
    }
};

/**
 * Ermöglicht einem Benutzer die Teilnahme an einem globalen Ziel.
 * @param {Object} req - Das Express-Request-Objekt.
 * @param {Object} res - Das Express-Response-Objekt.
 */
const participateInGlobalGoal = async (req, res) => {
    try {
        const goal = await GlobalGoalModel.findById(req.params.goalId);
        if (!goal) {
            return res
            .status(404)
            .json({ error: 'Globales Ziel nicht gefunden' });
        }

        goal.currentValue += goal.stepSize; // Schrittgröße verwenden

        if (goal.currentValue > goal.targetValue) {
            goal.currentValue = goal.targetValue;
        }

        goal.participationCount += 1;

        await goal.save();
        logger.info(
            `Benutzer hat am globalen Ziel teilgenommen: ${goal.title}`
        );
        res.status(200).json(goal);
    } catch (error) {
        logger.error(
            `Fehler bei der Teilnahme am globalen Ziel: ${error.message}`
        );
        res.status(500).json({
             error: 'Fehler bei der Teilnahme am globalen Ziel', 
            });
    }
};

module.exports = {
    addGlobalGoal,
    getGlobalGoals,
    updateGlobalGoal,
    deleteGlobalGoal,
    participateInGlobalGoal,
};
