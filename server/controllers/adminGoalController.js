const User = require('../models/user');
const GlobalGoal = require('../models/globalGoal');

exports.getAllUserGoals = async (req, res) => {
    try {
        const users = await User.find().populate('goals');
        const allGoals = users.flatMap((user) =>
            user.goals.map((goal) => ({
                ...goal.toObject(),
                user: { _id: user._id, username: user.username },
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
    try {
        const { goalId } = req.params;
        const { title, description, status } = req.body;

        const user = await User.findOne({ 'goals._id': goalId });
        if (!user) {
            return res.status(404).json({ message: 'Goal not found' });
        }

        const goal = user.goals.id(goalId);
        if (!goal) {
            return res.status(404).json({ message: 'Goal not found' });
        }

        goal.title = title;
        goal.description = description;
        goal.status = status;

        await user.save();
        res.json(goal);
    } catch (error) {
        res.status(500).json({
            message: 'Error updating user goal',
            error: error.message,
        });
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
        let totalUsers, totalGlobalGoals, users, globalGoals;

        try {
            totalUsers = await User.countDocuments();
        } catch (error) {
            throw error;
        }

        try {
            totalGlobalGoals = await GlobalGoal.countDocuments();
        } catch (error) {
            throw error;
        }

        try {
            users = await User.find().sort({ createdAt: -1 });
        } catch (error) {
            throw error;
        }

        const totalUserGoals = users.reduce(
            (sum, user) => sum + (user.goals ? user.goals.length : 0),
            0
        );

        const activeUsers = users.filter(
            (user) => user.goals && user.goals.length > 0
        ).length;

        const averageGoalsPerUser =
            totalUsers > 0 ? totalUserGoals / totalUsers : 0;

        const completedUserGoals = users.reduce(
            (sum, user) =>
                sum +
                (user.goals
                    ? user.goals.filter((goal) => goal.status === 'completed')
                          .length
                    : 0),
            0
        );

        const completionRate =
            totalUserGoals > 0
                ? (completedUserGoals / totalUserGoals) * 100
                : 0;

        try {
            globalGoals = await GlobalGoal.find();
        } catch (error) {
            throw error;
        }

        let mostPopularGlobalGoal = {
            title: 'N/A',
            participationCount: 0,
            targetValue: 0,
            currentValue: 0,
        };
        if (globalGoals.length > 0) {
            mostPopularGlobalGoal = globalGoals.reduce((prev, current) =>
                (prev.participationCount || 0) >
                (current.participationCount || 0)
                    ? prev
                    : current
            );
        }

        const now = new Date();
        const oneWeekFromNow = new Date(
            now.getTime() + 7 * 24 * 60 * 60 * 1000
        );

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

        const stats = {
            totalUsers,
            totalGlobalGoals,
            totalUserGoals,
            activeUsers,
            averageGoalsPerUser: averageGoalsPerUser.toFixed(2),
            completedUserGoals,
            completionRate: completionRate.toFixed(2),
            mostPopularGlobalGoal: {
                title: mostPopularGlobalGoal.title,
                participationCount:
                    mostPopularGlobalGoal.participationCount || 0,
                targetValue: mostPopularGlobalGoal.targetValue || 0,
                currentValue: mostPopularGlobalGoal.currentValue || 0,
                unit: mostPopularGlobalGoal.unit || 'Fortschritt',
            },
            upcomingGoals,
        };

        res.json(stats);
    } catch (error) {
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
