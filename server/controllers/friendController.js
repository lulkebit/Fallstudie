const Friend = require('../models/friend');

const sendFriendRequest = async (req, res) => {
    const { userId, friendId } = req.body;
    const friendRequest = new Friend({ userId, friendId });
    await friendRequest.save();
    res.status(201).json(friendRequest);
};

const acceptFriendRequest = async (req, res) => {
    const { requestId } = req.params;
    const friendRequest = await Friend.findByIdAndUpdate(
        requestId,
        { status: 'accepted' },
        { new: true }
    );
    res.status(200).json(friendRequest);
};

const declineFriendRequest = async (req, res) => {
    const { requestId } = req.params;
    const friendRequest = await Friend.findByIdAndUpdate(
        requestId,
        { status: 'declined' },
        { new: true }
    );
    res.status(200).json(friendRequest);
};

const getFriends = async (req, res) => {
    const { userId } = req.params;
    const friends = await Friend.find({ userId, status: 'accepted' }).populate(
        'friendId'
    );
    res.status(200).json(friends);
};

module.exports = {
    sendFriendRequest,
    acceptFriendRequest,
    declineFriendRequest,
    getFriends,
};
