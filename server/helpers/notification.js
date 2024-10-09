const Notification = require('../models/notification');

const sendNotification = async (userId, message) => {
    const notification = new Notification({ userId, message });
    await notification.save();
};

module.exports = { sendNotification };
