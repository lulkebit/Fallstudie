const User = require('../models/user');
const logger = require('../utils/logger');

const addGoal = async (req, res) => {
    const { userId, goal } = req.body;
    try {
        logger.info('Hinzufügen eines neuen Ziels für Benutzer:', userId);
        const user = await User.findById(userId);
        if (!user) {
            logger.warn('Benutzer nicht gefunden:', userId);
            return res.status(404).json({ error: 'Benutzer nicht gefunden' });
        }

        const highestId = user.goals.reduce(
            (maxId, goal) => Math.max(maxId, goal.id),
            0
        );
        const newGoal = {
            ...goal,
            id: highestId + 1,
        };

        user.goals.push(newGoal);
        await user.save();
        logger.info('Ziel hinzugefügt:', newGoal);
        res.status(200).json(user.goals);
    } catch (error) {
        logger.error('Fehler beim Hinzufügen des Ziels:', error);
        res.status(500).json({ error: 'Fehler beim Hinzufügen des Ziels' });
    }
};

const getGoals = async (req, res) => {
    const { userId } = req.query;
    try {
        logger.info('Abrufen der Ziele für Benutzer:', userId);
        const user = await User.findById(userId);
        if (!user) {
            logger.warn('Benutzer nicht gefunden:', userId);
            return res.status(404).json({ error: 'Benutzer nicht gefunden' });
        }
        logger.info('Ziele gefunden:', user.goals);
        res.status(200).json(user.goals);
    } catch (error) {
        logger.error('Fehler beim Abrufen der Ziele:', error);
        res.status(500).json({ error: 'Fehler beim Abrufen der Ziele' });
    }
};

const deleteGoal = async (req, res) => {
    const { userId } = req.body;
    const { id } = req.params;
    try {
        logger.info('Löschen des Ziels mit ID:', id, 'für Benutzer:', userId);
        const user = await User.findById(userId);
        if (!user) {
            logger.warn('Benutzer nicht gefunden:', userId);
            return res.status(404).json({ error: 'Benutzer nicht gefunden' });
        }
        user.goals = user.goals.filter((goal) => goal.id !== parseInt(id));
        await user.save();
        logger.info('Ziel gelöscht:', id);
        res.status(200).json(user.goals);
    } catch (error) {
        logger.error('Fehler beim Löschen des Ziels:', error);
        res.status(500).json({ error: 'Fehler beim Löschen des Ziels' });
    }
};

const updateGoal = async (req, res) => {
    const { userId, goal } = req.body;
    const { id } = req.params;
    try {
        logger.info(`Aktualisiere Ziel mit ID ${id} für Benutzer ${userId}`);
        const user = await User.findById(userId);
        if (!user) {
            logger.warn(`Benutzer mit ID ${userId} nicht gefunden`);
            return res.status(404).json({ error: 'Benutzer nicht gefunden' });
        }
        const goalIndex = user.goals.findIndex((g) => g.id === parseInt(id));
        if (goalIndex === -1) {
            logger.warn(`Ziel mit ID ${id} nicht gefunden`);
            return res.status(404).json({ error: 'Ziel nicht gefunden' });
        }
        user.goals[goalIndex] = goal;
        await user.save();
        logger.info(`Ziel mit ID ${id} erfolgreich aktualisiert`);
        res.status(200).json(user.goals);
    } catch (error) {
        logger.error('Fehler beim Aktualisieren des Ziels:', error);
        res.status(500).json({ error: 'Fehler beim Aktualisieren des Ziels' });
    }
};

module.exports = {
    addGoal,
    getGoals,
    deleteGoal,
    updateGoal,
};
