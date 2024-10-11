const Notification = require('../models/notification');

const sendNotification = async (userId, title, message, read) => {
    const notification = new Notification({
        userId,
        title,
        message,
        read,
    });
    await notification.save();
    return notification;
};

module.exports = { sendNotification };
