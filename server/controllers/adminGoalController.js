const User = require('../models/user');

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
