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
            console.log('Total users:', totalUsers);
        } catch (error) {
            console.error('Error counting users:', error);
            throw error;
        }

        try {
            totalGlobalGoals = await GlobalGoal.countDocuments();
            console.log('Total global goals:', totalGlobalGoals);
        } catch (error) {
            console.error('Error counting global goals:', error);
            throw error;
        }

        try {
            users = await User.find();
            console.log('Users found:', users.length);
        } catch (error) {
            console.error('Error finding users:', error);
            throw error;
        }

        const totalUserGoals = users.reduce(
            (sum, user) => sum + (user.goals ? user.goals.length : 0),
            0
        );
        console.log('Total user goals:', totalUserGoals);

        const activeUsers = users.filter(
            (user) => user.goals && user.goals.length > 0
        ).length;
        console.log('Active users:', activeUsers);

        const averageGoalsPerUser =
            totalUsers > 0 ? totalUserGoals / totalUsers : 0;
        console.log('Average goals per user:', averageGoalsPerUser);

        const completedUserGoals = users.reduce(
            (sum, user) =>
                sum +
                (user.goals
                    ? user.goals.filter((goal) => goal.status === 'completed')
                          .length
                    : 0),
            0
        );
        console.log('Completed user goals:', completedUserGoals);

        const completionRate =
            totalUserGoals > 0
                ? (completedUserGoals / totalUserGoals) * 100
                : 0;
        console.log('Completion rate:', completionRate);

        try {
            globalGoals = await GlobalGoal.find();
            console.log('Global goals found:', globalGoals.length);
        } catch (error) {
            console.error('Error finding global goals:', error);
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
        console.log('Most popular global goal:', mostPopularGlobalGoal.title);

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
        };

        res.json(stats);
    } catch (error) {
        console.error('Error in getAdminStats:', error);
        res.status(500).json({
            message: 'Error fetching admin statistics',
            error: error.message,
        });
    }
};
