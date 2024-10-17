const User = require('../models/user');
const Friend = require('../models/friend');
const logger = require('../utils/logger');
const texts = require('../ressources/texts');

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
            public: goal.public === 'on',
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
        user.goals[goalIndex] = goal;
        await user.save();
        logger.info(texts.SUCCESS.GOAL_UPDATED);
        res.status(200).json(user.goals);
    } catch (error) {
        logger.error(texts.ERRORS.ERROR('updating goal', error));
        res.status(500).json({ error: texts.ERRORS.UPDATE_GOAL });
    }
};

const getPublicGoalsOfFriends = async (req, res) => {
    try {
        const userId = req.params.userId;
        logger.info(texts.INFO.FETCHING_PUBLIC_GOALS(userId));

        const friendships = await Friend.find({
            userId,
            status: 'accepted',
        }).populate('friendId');

        if (!friendships) {
            logger.warn(texts.WARNINGS.NO_FRIENDS_FOUND);
            return res.status(200).json([]);
        }

        const publicGoals = await Promise.all(
            friendships.map(async (friendship) => {
                const friend = friendship.friendId;
                const friendGoals = friend.goals.filter((goal) => goal.public);
                return friendGoals.map((goal) => ({
                    ...goal.toObject(),
                    friendName: friend.username,
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

module.exports = {
    addGoal,
    getGoals,
    deleteGoal,
    updateGoal,
    getPublicGoalsOfFriends,
    getPublicGoalsOfFriend,
};
