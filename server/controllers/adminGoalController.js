const User = require('../models/user');
const GlobalGoal = require('../models/globalGoal');
const { getPageViewStats } = require('../middleware/pageViewMiddleware');
const logger = require('../utils/logger');
const texts = require('../ressources/texts');

exports.getAllUserGoals = async (req, res) => {
    try {
        const users = await User.find().populate('goals');
        const allGoals = users.flatMap((user) =>
            user.goals.map((goal) => ({
                ...goal.toObject(),
                user: {
                    _id: user._id,
                    username: user.username,
                    avatar: user.avatar,
                },
            }))
        );
        res.json(allGoals);
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching user goals',
            error: error.message,
        });
    }
};

exports.updateUserGoal = async (req, res) => {
    const { userId, goal, id } = req.body;
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
        logger.error(texts.ERRORS.ERROR('updating goal ' + error, error));
        res.status(500).json({ error: texts.ERRORS.UPDATE_GOAL });
    }
};

exports.deleteUserGoal = async (req, res) => {
    try {
        const { goalId } = req.params;

        const user = await User.findOne({ 'goals._id': goalId });
        if (!user) {
            return res.status(404).json({ message: 'Goal not found' });
        }

        user.goals = user.goals.filter(
            (goal) => goal._id.toString() !== goalId
        );
        await user.save();

        res.json({ message: 'Goal deleted successfully' });
    } catch (error) {
        res.status(500).json({
            message: 'Error deleting user goal',
            error: error.message,
        });
    }
};

exports.getAdminStats = async (req, res) => {
    try {
        // Einzelne Try-Catch-Blöcke für besseres Error Handling
        let stats = {};

        // 1. Basis Nutzer Statistiken
        try {
            const users = await User.find();
            stats.totalUsers = users.length;

            const activeUsers = users.filter(
                (user) => user.goals && user.goals.length > 0
            );
            stats.activeUsers = activeUsers.length;

            const totalUserGoals = users.reduce(
                (sum, user) => sum + (user.goals ? user.goals.length : 0),
                0
            );
            stats.totalUserGoals = totalUserGoals;

            stats.averageGoalsPerUser =
                totalUserGoals > 0
                    ? (totalUserGoals / users.length).toFixed(2)
                    : 0;

            const completedUserGoals = users.reduce((sum, user) => {
                if (!user.goals) return sum;
                return (
                    sum +
                    user.goals.filter((goal) => {
                        // Überprüfe, ob targetValue eine gültige Zahl ist
                        const target = parseFloat(goal.targetValue);
                        if (isNaN(target) || target === 0) return false;

                        // Berechne den Fortschritt als Prozentsatz
                        const progress = (goal.currentValue / target) * 100;
                        return progress >= 100;
                    }).length
                );
            }, 0);

            stats.completionRate =
                totalUserGoals > 0
                    ? ((completedUserGoals / totalUserGoals) * 100).toFixed(2)
                    : 0;
        } catch (error) {
            console.error('Error fetching user statistics:', error);
            stats.userError = 'Error fetching user statistics';
        }

        // 2. Globale Ziele Statistiken
        try {
            const globalGoals = await GlobalGoal.find();
            stats.totalGlobalGoals = globalGoals.length;

            // Most popular global goal
            let mostPopularGlobalGoal = {
                title: 'N/A',
                participationCount: 0,
                targetValue: 0,
                currentValue: 0,
                unit: 'Fortschritt',
            };

            if (globalGoals.length > 0) {
                const uncompletedGoals = globalGoals.filter((goal) => {
                    const progress =
                        (goal.currentValue / goal.targetValue) * 100;
                    return progress < 100;
                });

                if (uncompletedGoals.length > 0) {
                    mostPopularGlobalGoal = uncompletedGoals.reduce(
                        (prev, current) =>
                            (prev.participationCount || 0) >
                            (current.participationCount || 0)
                                ? prev
                                : current
                    );
                }
            }

            stats.mostPopularGlobalGoal = {
                title: mostPopularGlobalGoal.title,
                participationCount:
                    mostPopularGlobalGoal.participationCount || 0,
                targetValue: mostPopularGlobalGoal.targetValue || 0,
                currentValue: mostPopularGlobalGoal.currentValue || 0,
                unit: mostPopularGlobalGoal.unit || 'Fortschritt',
            };
        } catch (error) {
            console.error('Error fetching global goals statistics:', error);
            stats.globalGoalsError = 'Error fetching global goals statistics';
        }

        // 3. Upcoming Goals
        try {
            const now = new Date();
            const oneWeekFromNow = new Date(
                now.getTime() + 7 * 24 * 60 * 60 * 1000
            );

            const users = await User.find();
            const upcomingGoals = users.reduce((goals, user) => {
                if (user.goals) {
                    const userUpcomingGoals = user.goals
                        .filter(
                            (goal) =>
                                goal.endDate &&
                                goal.endDate > now &&
                                goal.endDate <= oneWeekFromNow
                        )
                        .map((goal) => ({
                            avatar: user.avatar,
                            username: user.username,
                            title: goal.title,
                            endDate: goal.endDate,
                        }));
                    return [...goals, ...userUpcomingGoals];
                }
                return goals;
            }, []);

            upcomingGoals.sort((a, b) => a.endDate - b.endDate);
            stats.upcomingGoals = upcomingGoals;
        } catch (error) {
            console.error('Error fetching upcoming goals:', error);
            stats.upcomingGoalsError = 'Error fetching upcoming goals';
        }

        // 4. Page View Statistics
        try {
            const pageViewStats = await getPageViewStats();
            stats.pageViewCount = pageViewStats.pageViewCount;
            stats.pageViewsData = pageViewStats.pageViewsData;
        } catch (error) {
            console.error('Error fetching page view statistics:', error);
            stats.pageViewsData = [];
            stats.pageViewCount = 0;
        }

        res.json(stats);
    } catch (error) {
        console.error('Error in getAdminStats:', error);
        res.status(500).json({
            message: 'Error fetching admin statistics',
            error: error.message,
        });
    }
};

exports.getUserGrowthStats = async (req, res) => {
    try {
        const { interval = 'month', range = 6 } = req.query;
        const stats = [];

        const now = new Date();

        const intervalConfigs = {
            hour: {
                unit: 'hour',
                format: { hour: '2-digit', minute: '2-digit' },
                getStart: (date, offset = 0) => {
                    const start = new Date(date);
                    start.setUTCHours(date.getUTCHours() - offset, 0, 0, 0);
                    return start;
                },
                getEnd: (date, offset = 0) => {
                    const end = new Date(date);
                    end.setUTCHours(date.getUTCHours() - offset + 1, 0, 0, -1);
                    return end;
                },
            },
            day: {
                unit: 'day',
                format: { day: '2-digit', month: '2-digit' },
                getStart: (date, offset = 0) => {
                    const start = new Date(date);
                    start.setUTCDate(date.getUTCDate() - offset);
                    start.setUTCHours(0, 0, 0, 0);
                    return start;
                },
                getEnd: (date, offset = 0) => {
                    const end = new Date(date);
                    end.setUTCDate(date.getUTCDate() - offset);
                    end.setUTCHours(23, 59, 59, 999);
                    return end;
                },
            },
            week: {
                unit: 'week',
                format: { day: '2-digit', month: '2-digit' },
                getStart: (date, offset = 0) => {
                    const start = new Date(date);
                    start.setUTCDate(date.getUTCDate() - offset * 7);
                    start.setUTCHours(0, 0, 0, 0);
                    return start;
                },
                getEnd: (date, offset = 0) => {
                    const end = new Date(date);
                    end.setUTCDate(date.getUTCDate() - offset * 7);
                    end.setUTCHours(23, 59, 59, 999);
                    return end;
                },
            },
            month: {
                unit: 'month',
                format: { month: 'short', year: '2-digit' },
                getStart: (date, offset = 0) => {
                    const start = new Date(date);
                    start.setUTCMonth(date.getUTCMonth() - offset);
                    start.setUTCDate(1);
                    start.setUTCHours(0, 0, 0, 0);
                    return start;
                },
                getEnd: (date, offset = 0) => {
                    const end = new Date(date);
                    end.setUTCMonth(date.getUTCMonth() - offset + 1);
                    end.setUTCDate(0);
                    end.setUTCHours(23, 59, 59, 999);
                    return end;
                },
            },
        };

        const config = intervalConfigs[interval];
        if (!config) {
            return res.status(400).json({ error: 'Invalid interval' });
        }

        for (let i = range - 1; i >= 0; i--) {
            const periodStart = config.getStart(now, i);
            const periodEnd = config.getEnd(now, i);

            const newUsers = await User.countDocuments({
                createdAt: {
                    $gte: periodStart,
                    $lte: periodEnd,
                },
            });

            const totalUsers = await User.countDocuments({
                createdAt: {
                    $lte: periodEnd,
                },
            });

            stats.push({
                period: periodEnd.toLocaleString('de-DE', {
                    ...config.format,
                    timeZone: 'UTC',
                }),
                newUsers,
                totalUsers,
                timestamp: periodEnd.getTime(),
            });
        }

        stats.sort((a, b) => a.timestamp - b.timestamp);

        res.json({
            interval,
            stats,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching user growth statistics',
            error: error.message,
        });
    }
};
