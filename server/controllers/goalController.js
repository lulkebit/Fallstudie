const User = require('../models/user');
const Friend = require('../models/friend');
const logger = require('../utils/logger');
const texts = require('../ressources/texts');

/**
 * Fügt ein neues Ziel für einen Benutzer hinzu.
 *
 * @param {Object} req - Das Express-Request-Objekt.
 * @param {Object} req.body - Der Körper der Anfrage.
 * @param {string} req.body.userId - Die ID des Benutzers.
 * @param {Object} req.body.goal - Das hinzuzufügende Ziel.
 * @param {Object} res - Das Express-Response-Objekt.
 * @returns {Promise<Array>} Ein Promise, das bei Erfolg ein Array aller Ziele des Benutzers zurückgibt.
 * @throws {Object} Bei Fehlern während des Hinzufügens wird ein Fehler-Objekt zurückgegeben.
 */
const addGoal = async (req, res) => {
    const { userId, goal } = req.body;
    try {
        logger.info(texts.INFO.ADDING_GOAL(userId));
        const user = await User.findById(userId);
        if (!user) {
            logger.warn(texts.WARNINGS.USER_NOT_FOUND);
            return res.status(404).json({ error: texts.ERRORS.USER_NOT_FOUND });
        }

        const highestId = user.goals.reduce(
            (maxId, goal) => Math.max(maxId, goal.id),
            0
        );
        const newGoal = {
            ...goal,
            id: highestId + 1,
            public: Boolean(goal.public), // Convert to boolean explicitly
        };

        user.goals.push(newGoal);
        await user.save();
        logger.info(texts.SUCCESS.GOAL_ADDED);
        res.status(200).json(user.goals);
    } catch (error) {
        logger.error(texts.ERRORS.ERROR('adding goal', error));
        res.status(500).json({ error: texts.ERRORS.ADD_GOAL });
    }
};

/**
 * Ruft alle Ziele eines Benutzers ab.
 *
 * @param {Object} req - Das Express-Request-Objekt.
 * @param {Object} req.query - Die Query-Parameter der Anfrage.
 * @param {string} req.query.userId - Die ID des Benutzers.
 * @param {Object} res - Das Express-Response-Objekt.
 * @returns {Promise<Array>} Ein Promise, das bei Erfolg ein Array aller Ziele des Benutzers zurückgibt.
 * @throws {Object} Bei Fehlern während des Abrufens wird ein Fehler-Objekt zurückgegeben.
 */
const getGoals = async (req, res) => {
    const { userId } = req.query;
    try {
        logger.info(texts.INFO.FETCHING_GOALS(userId));
        const user = await User.findById(userId);
        if (!user) {
            logger.warn(texts.WARNINGS.USER_NOT_FOUND);
            return res.status(404).json({ error: texts.ERRORS.USER_NOT_FOUND });
        }
        logger.info(texts.SUCCESS.GOAL_LOADED);
        res.status(200).json(user.goals);
    } catch (error) {
        logger.error(texts.ERRORS.ERROR('fetching goals', error));
        res.status(500).json({ error: texts.ERRORS.FETCH_GOALS });
    }
};

/**
 * Löscht ein Ziel eines Benutzers.
 *
 * @param {Object} req - Das Express-Request-Objekt.
 * @param {Object} req.body - Der Körper der Anfrage.
 * @param {string} req.body.userId - Die ID des Benutzers.
 * @param {Object} req.params - Die Parameter der Anfrage.
 * @param {string} req.params.id - Die ID des zu löschenden Ziels.
 * @param {Object} res - Das Express-Response-Objekt.
 * @returns {Promise<Array>} Ein Promise, das bei Erfolg ein aktualisiertes Array aller Ziele des Benutzers zurückgibt.
 * @throws {Object} Bei Fehlern während des Löschens wird ein Fehler-Objekt zurückgegeben.
 */
const deleteGoal = async (req, res) => {
    const { userId } = req.body;
    const { id } = req.params;
    try {
        logger.info(texts.INFO.DELETING_GOAL(id, userId));
        const user = await User.findById(userId);
        if (!user) {
            logger.warn(texts.WARNINGS.USER_NOT_FOUND);
            return res.status(404).json({ error: texts.ERRORS.USER_NOT_FOUND });
        }
        user.goals = user.goals.filter((goal) => goal.id !== parseInt(id));
        await user.save();
        logger.info(texts.SUCCESS.GOAL_DELETED);
        res.status(200).json(user.goals);
    } catch (error) {
        logger.error(texts.ERRORS.ERROR('deleting goal', error));
        res.status(500).json({ error: texts.ERRORS.DELETE_GOAL });
    }
};

/**
 * Aktualisiert ein Ziel eines Benutzers.
 *
 * @param {Object} req - Das Express-Request-Objekt.
 * @param {Object} req.body - Der Körper der Anfrage.
 * @param {string} req.body.userId - Die ID des Benutzers.
 * @param {Object} req.body.goal - Das aktualisierte Ziel.
 * @param {Object} req.params - Die Parameter der Anfrage.
 * @param {string} req.params.id - Die ID des zu aktualisierenden Ziels.
 * @param {Object} res - Das Express-Response-Objekt.
 * @returns {Promise<Array>} Ein Promise, das bei Erfolg ein aktualisiertes Array aller Ziele des Benutzers zurückgibt.
 * @throws {Object} Bei Fehlern während der Aktualisierung wird ein Fehler-Objekt zurückgegeben.
 */
const updateGoal = async (req, res) => {
    const { userId, goal } = req.body;
    const { id } = req.params;
    try {
        logger.info(texts.INFO.UPDATING_GOAL(id, userId));
        const user = await User.findById(userId);
        if (!user) {
            logger.warn(texts.WARNINGS.USER_NOT_FOUND);
            return res.status(404).json({ error: texts.ERRORS.USER_NOT_FOUND });
        }
        const goalIndex = user.goals.findIndex((g) => g.id === parseInt(id));
        if (goalIndex === -1) {
            logger.warn(texts.ERRORS.GOAL_NOT_FOUND);
            return res.status(404).json({ error: texts.ERRORS.GOAL_NOT_FOUND });
        }
        user.goals[goalIndex] = {
            ...goal,
            public: Boolean(goal.public), // Convert to boolean explicitly
        };
        await user.save();
        logger.info(texts.SUCCESS.GOAL_UPDATED);
        res.status(200).json(user.goals);
    } catch (error) {
        logger.error(texts.ERRORS.ERROR('updating goal', error));
        res.status(500).json({ error: texts.ERRORS.UPDATE_GOAL });
    }
};

/**
 * Ruft die öffentlichen Ziele aller Freunde eines Benutzers ab.
 *
 * @param {Object} req - Das Express-Request-Objekt.
 * @param {Object} req.params - Die Parameter der Anfrage.
 * @param {string} req.params.userId - Die ID des Benutzers.
 * @param {Object} res - Das Express-Response-Objekt.
 * @returns {Promise<Array>} Ein Promise, das bei Erfolg ein Array aller öffentlichen Ziele der Freunde zurückgibt.
 * @throws {Object} Bei Fehlern während des Abrufens wird ein Fehler-Objekt zurückgegeben.
 */
const getPublicGoalsOfFriends = async (req, res) => {
    try {
        const userId = req.params.userId;
        logger.info(texts.INFO.FETCHING_PUBLIC_GOALS(userId));

        const user = await User.findById(userId);
        if (!user) {
            logger.warn(texts.WARNINGS.USER_NOT_FOUND);
            return res.status(404).json({ error: texts.ERRORS.USER_NOT_FOUND });
        }

        const friendships = await Friend.find({
            userId,
            status: 'accepted',
        }).populate('friendId');

        if (!friendships || friendships.length === 0) {
            logger.warn(texts.WARNINGS.NO_FRIENDS_FOUND);
            return res.status(200).json([]);
        }

        const publicGoals = await Promise.all(
            friendships.map(async (friendship) => {
                const friend = friendship.friendId;
                if (!friend) {
                    return [];
                }

                const friendGoals = friend.goals.filter((goal) => goal.public);

                const pinnedGoals = user.pinnedFriendGoals || [];
                const pinnedFriendGoals = pinnedGoals.filter(
                    (pinnedGoal) =>
                        pinnedGoal.friendId &&
                        pinnedGoal.friendId.toString() === friend._id.toString()
                );

                return friendGoals.map((goal) => ({
                    ...goal.toObject(),
                    friendName: friend.username,
                    friendId: friend._id,
                    friendAvatar: friend.avatar,
                    isPinned: pinnedFriendGoals.some(
                        (pinnedGoal) => pinnedGoal.goalId === goal.id
                    ),
                }));
            })
        );

        const flattenedPublicGoals = publicGoals.flat();

        logger.info(
            texts.INFO.PUBLIC_GOALS_RETRIEVED(
                flattenedPublicGoals.length,
                userId
            )
        );
        res.status(200).json(flattenedPublicGoals);
    } catch (error) {
        logger.error(
            texts.ERRORS.ERROR('retrieving public goals of friends', error)
        );
        res.status(500).json({ error: texts.ERRORS.FETCH_PUBLIC_GOALS });
    }
};

/**
 * Ruft die öffentlichen Ziele eines bestimmten Freundes ab.
 *
 * @param {Object} req - Das Express-Request-Objekt.
 * @param {Object} req.params - Die Parameter der Anfrage.
 * @param {string} req.params.friendId - Die ID des Freundes.
 * @param {Object} res - Das Express-Response-Objekt.
 * @returns {Promise<Array>} Ein Promise, das bei Erfolg ein Array aller öffentlichen Ziele des Freundes zurückgibt.
 * @throws {Object} Bei Fehlern während des Abrufens wird ein Fehler-Objekt zurückgegeben.
 */
const getPublicGoalsOfFriend = async (req, res) => {
    try {
        const { friendId } = req.params;
        logger.info(texts.INFO.FETCHING_PUBLIC_GOALS(friendId));

        const friend = await User.findById(friendId);

        if (!friend) {
            logger.warn(texts.WARNINGS.USER_NOT_FOUND);
            return res.status(404).json({ error: texts.ERRORS.USER_NOT_FOUND });
        }

        const publicGoals = friend.goals.filter((goal) => goal.public);

        logger.info(
            texts.INFO.PUBLIC_GOALS_RETRIEVED(publicGoals.length, friendId)
        );
        res.status(200).json(publicGoals);
    } catch (error) {
        logger.error(
            texts.ERRORS.ERROR('retrieving public goals of friend', error)
        );
        res.status(500).json({ error: texts.ERRORS.FETCH_PUBLIC_GOALS });
    }
};

/**
 * Pinnt ein Ziel für einen Benutzer an.
 *
 * @param {Object} req - Das Express-Request-Objekt.
 * @param {Object} req.body - Der Körper der Anfrage.
 * @param {string} req.body.userId - Die ID des Benutzers.
 * @param {Array} req.body.goals - Die aktualisierten Ziele des Benutzers.
 * @param {Object} res - Das Express-Response-Objekt.
 * @returns {Promise<Array>} Ein Promise, das bei Erfolg ein aktualisiertes Array aller Ziele des Benutzers zurückgibt.
 * @throws {Object} Bei Fehlern während des Pinnens wird ein Fehler-Objekt zurückgegeben.
 */
const pinGoal = async (req, res) => {
    const { userId, goals } = req.body;
    try {
        logger.info(`Received pinGoal request for userId: ${userId}`);
        logger.info(`Request body: ${JSON.stringify(req.body)}`);
        logger.info(`Request headers: ${JSON.stringify(req.headers)}`);
        logger.info(`Request method: ${req.method}`);
        logger.info(`Request URL: ${req.originalUrl}`);

        const user = await User.findById(userId);
        if (!user) {
            logger.warn(`User not found for userId: ${userId}`);
            return res.status(404).json({ error: texts.ERRORS.USER_NOT_FOUND });
        }

        user.goals = goals;
        await user.save();

        logger.info(`Successfully pinned goal for userId: ${userId}`);
        res.status(200).json(user.goals);
    } catch (error) {
        logger.error(`Error pinning goal: ${error.message}`);
        logger.error(`Error stack: ${error.stack}`);
        res.status(500).json({ error: texts.ERRORS.PIN_GOAL });
    }
};

const participateInGoal = async (req, res) => {
    const { userId, goalId } = req.body;
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'Benutzer nicht gefunden' });
        }

        const goal = user.goals.find((goal) => goal.id === goalId);
        if (!goal) {
            return res.status(404).json({ error: 'Ziel nicht gefunden' });
        }

        goal.participationCount += 1;
        goal.currentValue += goal.stepSize;

        if (goal.currentValue > goal.targetValue) {
            goal.currentValue = goal.targetValue;
        }

        await user.save();
        res.status(200).json(user.goals);
    } catch (error) {
        res.status(500).json({ error: 'Fehler beim Teilnehmen am Ziel' });
    }
};

module.exports = {
    addGoal,
    getGoals,
    deleteGoal,
    updateGoal,
    getPublicGoalsOfFriends,
    getPublicGoalsOfFriend,
    pinGoal,
    participateInGoal,
};
