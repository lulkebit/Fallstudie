const mongoose = require('mongoose');

const friendSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    friendId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'declined'],
        default: 'pending',
    },
    notificationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Notification',
    },
});

module.exports = mongoose.model('Friend', friendSchema);
