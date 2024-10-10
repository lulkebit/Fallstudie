const Notification = require('../models/notification');

const sendNotification = async (userId, message, read) => {
    const notification = new Notification({
        userId,
        message,
        read,
    });
    await notification.save();
    return notification;
};

module.exports = { sendNotification };
