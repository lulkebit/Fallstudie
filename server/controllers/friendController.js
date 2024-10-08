const Friend = require('../models/friend');
const User = require('../models/user');
const logger = require('../utils/logger');

const sendFriendRequest = async (req, res) => {
    const { userId, friendUsername } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) {
            logger.warn(`User with ID ${userId} not found`);
            return res.status(404).json({ error: 'User not found' });
        }

        if (user.username === friendUsername) {
            logger.warn(
                `User ${user.username} cannot send a friend request to himself`
            );
            return res.status(400).json({
                error: 'You cannot send a friend request to yourself',
            });
        }

        logger.info(
            `User ${userId} is sending a friend request to ${friendUsername}`
        );
        const friend = await User.findOne({ username: friendUsername });
        if (!friend) {
            logger.warn(`User ${friendUsername} not found`);
            return res.status(404).json({ error: 'User not found' });
        }

        const friendRequest = new Friend({ userId, friendId: friend._id });
        await friendRequest.save();
        logger.info(
            `Friend request from ${userId} to ${friend._id} saved successfully`
        );
        res.status(201).json(friendRequest);
    } catch (error) {
        logger.error('Error sending friend request:', error);
        res.status(500).json({ error: 'Error sending friend request' });
    }
};

const acceptFriendRequest = async (req, res) => {
    const { requestId } = req.params;
    try {
        const friendRequest = await Friend.findById(requestId);
        if (!friendRequest) {
            return res.status(404).json({ error: 'Friend request not found' });
        }

        friendRequest.status = 'accepted';
        await friendRequest.save();

        const reciprocalFriendRequest = new Friend({
            userId: friendRequest.friendId,
            friendId: friendRequest.userId,
            status: 'accepted',
        });
        await reciprocalFriendRequest.save();

        logger.info(`Friend request with ID ${requestId} accepted`);
        res.status(200).json(friendRequest);
    } catch (error) {
        logger.error('Error accepting friend request:', error);
        res.status(500).json({ error: 'Error accepting friend request' });
    }
};

const declineFriendRequest = async (req, res) => {
    const { requestId } = req.params;
    try {
        logger.info(`Declining friend request with ID ${requestId}`);
        const friendRequest = await Friend.findByIdAndUpdate(
            requestId,
            { status: 'declined' },
            { new: true }
        );
        logger.info(`Friend request with ID ${requestId} declined`);
        res.status(200).json(friendRequest);
    } catch (error) {
        logger.error('Error declining friend request:', error);
        res.status(500).json({ error: 'Error declining friend request' });
    }
};

const getFriends = async (req, res) => {
    const { userId } = req.params;
    try {
        logger.info(`Fetching friends for user ${userId}`);
        const friends = await Friend.find({
            userId,
            status: 'accepted',
        }).populate('friendId');
        logger.info(`Friends fetched successfully for user ${userId}`);
        res.status(200).json(friends);
    } catch (error) {
        logger.error('Error fetching friends:', error);
        res.status(500).json({ error: 'Error fetching friends' });
    }
};

const getFriendRequests = async (req, res) => {
    const { userId } = req.params;
    try {
        logger.info(`Fetching friend requests for user ${userId}`);
        const friendRequests = await Friend.find({
            friendId: userId,
            status: 'pending',
        }).populate('userId');
        logger.info(`Friend requests fetched successfully for user ${userId}`);
        res.status(200).json(friendRequests);
    } catch (error) {
        logger.error('Error fetching friend requests:', error);
        res.status(500).json({ error: 'Error fetching friend requests' });
    }
};

const deleteFriend = async (req, res) => {
    const { userId, friendId } = req.params;
    try {
        await Friend.deleteOne({ userId, friendId });
        await Friend.deleteOne({ userId: friendId, friendId: userId });

        logger.info(`Friendship between ${userId} and ${friendId} deleted`);
        res.status(200).json({ message: 'Friendship deleted' });
    } catch (error) {
        logger.error('Error deleting friendship:', error);
        res.status(500).json({ error: 'Error deleting friendship' });
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
