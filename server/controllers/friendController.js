const Friend = require('../models/friend');
const User = require('../models/user');
const Notification = require('../models/notification');
const logger = require('../utils/logger');
const { sendNotification } = require('../helpers/notification');
const texts = require('../ressources/texts');

const sendFriendRequest = async (req, res) => {
    const { userId, friendUsername } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) {
            logger.warn(texts.ERRORS.USER_NOT_FOUND);
            return res.status(404).json({ error: texts.ERRORS.USER_NOT_FOUND });
        }

        if (user.username === friendUsername) {
            logger.warn(texts.WARNINGS.FRIEND_REQUEST_SELF(user.username));
            return res
                .status(400)
                .json({ error: texts.ERRORS.FRIEND_REQUEST_SELF });
        }

        logger.info(texts.INFO.SENDING_FRIEND_REQUEST(userId, friendUsername));
        const friend = await User.findOne({ username: friendUsername });
        if (!friend) {
            logger.warn(texts.ERRORS.USER_NOT_FOUND);
            return res.status(404).json({ error: texts.ERRORS.USER_NOT_FOUND });
        }

        const existingRequest = await Friend.findOne({
            userId,
            friendId: friend._id,
            status: { $in: ['pending', 'accepted'] },
        });
        if (existingRequest) {
            logger.warn(
                texts.WARNINGS.FRIEND_REQUEST_ALREADY_EXISTS(userId, friend._id)
            );
            return res
                .status(400)
                .json({ error: texts.ERRORS.FRIEND_REQUEST_ALREADY_SENT });
        }

        const friendRequest = new Friend({ userId, friendId: friend._id });
        await friendRequest.save();
        logger.info(texts.INFO.FRIEND_REQUEST_SAVED(userId, friend._id));

        const notification = await sendNotification(
            friend._id,
            texts.MESSAGES.FRIEND_REQUEST_NOTIFICATION(user.username),
            false
        );

        friendRequest.notificationId = notification._id;
        await friendRequest.save();

        res.status(201).json(friendRequest);
    } catch (error) {
        logger.error(texts.ERRORS.ERROR('sending friend request', error));
        res.status(500).json({ error: texts.ERRORS.SEND_FRIEND_REQUEST });
    }
};

const acceptFriendRequest = async (req, res) => {
    const { requestId } = req.params;
    try {
        logger.info(texts.INFO.ACCEPTING_FRIEND_REQUEST(requestId));
        const friendRequest = await Friend.findById(requestId);
        if (!friendRequest) {
            return res
                .status(404)
                .json({ error: texts.ERRORS.FRIEND_REQUEST_NOT_FOUND });
        }

        friendRequest.status = 'accepted';
        await friendRequest.save();

        const reciprocalFriendRequest = new Friend({
            userId: friendRequest.friendId,
            friendId: friendRequest.userId,
            status: 'accepted',
        });
        await reciprocalFriendRequest.save();

        const user = await User.findById(friendRequest.userId);
        const friend = await User.findById(friendRequest.friendId);

        if (!user.friends.includes(friendRequest.friendId)) {
            user.friends.push(friendRequest.friendId);
            await user.save();
        }

        if (!friend.friends.includes(friendRequest.userId)) {
            friend.friends.push(friendRequest.userId);
            await friend.save();
        }

        const notification = await Notification.findByIdAndUpdate(
            friendRequest.notificationId,
            { read: true },
            { new: true }
        );

        if (notification) {
            logger.info(texts.INFO.NOTIFICATION_MARKED_READ(notification._id));
        } else {
            logger.warn(texts.WARNINGS.NOTIFICATION_NOT_FOUND(requestId));
        }

        logger.info(texts.SUCCESS.FRIEND_REQUEST_ACCEPTED);
        res.status(200).json(friendRequest);
    } catch (error) {
        logger.error(texts.ERRORS.ERROR('accepting friend request', error));
        res.status(500).json({ error: texts.ERRORS.ACCEPT_FRIEND_REQUEST });
    }
};

const declineFriendRequest = async (req, res) => {
    const { requestId } = req.params;
    try {
        logger.info(texts.INFO.DECLINING_FRIEND_REQUEST(requestId));
        const friendRequest = await Friend.findByIdAndUpdate(
            requestId,
            { status: 'declined' },
            { new: true }
        );
        if (!friendRequest) {
            return res
                .status(404)
                .json({ error: texts.ERRORS.FRIEND_REQUEST_NOT_FOUND });
        }
        logger.info(texts.SUCCESS.FRIEND_REQUEST_DECLINED);
        res.status(200).json(friendRequest);
    } catch (error) {
        logger.error(texts.ERRORS.ERROR('declining friend request', error));
        res.status(500).json({ error: texts.ERRORS.DECLINE_FRIEND_REQUEST });
    }
};

const getFriends = async (req, res) => {
    const { userId } = req.params;
    try {
        logger.info(texts.INFO.FETCHING_FRIENDS(userId));
        const friends = await Friend.find({
            userId,
            status: 'accepted',
        }).populate('friendId');
        logger.info(texts.SUCCESS.FRIEND_REQUEST_ACCEPTED);
        res.status(200).json(friends);
    } catch (error) {
        logger.error(texts.ERRORS.ERROR('fetching friends', error));
        res.status(500).json({ error: texts.ERRORS.FETCH_FRIENDS });
    }
};

const getFriendRequests = async (req, res) => {
    const { userId } = req.params;
    try {
        logger.info(texts.INFO.FETCHING_FRIEND_REQUESTS(userId));
        const friendRequests = await Friend.find({
            friendId: userId,
            status: 'pending',
        }).populate('userId');
        logger.info(texts.SUCCESS.FRIEND_REQUEST_ACCEPTED);
        res.status(200).json(friendRequests);
    } catch (error) {
        logger.error(texts.ERRORS.ERROR('fetching friend requests', error));
        res.status(500).json({ error: texts.ERRORS.FETCH_FRIEND_REQUESTS });
    }
};

const deleteFriend = async (req, res) => {
    const { userId, friendId } = req.params;
    try {
        logger.info(texts.INFO.DELETING_FRIENDSHIP(userId, friendId));
        await Friend.deleteOne({ userId, friendId });
        await Friend.deleteOne({ userId: friendId, friendId: userId });

        logger.info(texts.SUCCESS.FRIENDSHIP_DELETED);
        res.status(200).json({ message: texts.SUCCESS.FRIENDSHIP_DELETED });
    } catch (error) {
        logger.error(texts.ERRORS.ERROR('deleting friendship', error));
        res.status(500).json({ error: texts.ERRORS.DELETE_FRIENDSHIP });
    }
};

module.exports = {
    sendFriendRequest,
    acceptFriendRequest,
    declineFriendRequest,
    getFriends,
    getFriendRequests,
    deleteFriend,
};
