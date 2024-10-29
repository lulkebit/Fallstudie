const Friend = require('../models/friend');
const User = require('../models/user');
const Notification = require('../models/notification');
const logger = require('../utils/logger');
const { createNotification } = require('../helpers/notification');
const texts = require('../ressources/texts');

/**
 * Sendet eine Freundschaftsanfrage von einem Benutzer an einen anderen.
 *
 * @param {Object} req - Das Express-Request-Objekt.
 * @param {Object} req.body - Der Körper der Anfrage.
 * @param {string} req.body.userId - Die ID des Benutzers, der die Anfrage sendet.
 * @param {string} req.body.friendUsername - Der Benutzername des Freundes, an den die Anfrage gesendet wird.
 * @param {Object} res - Das Express-Response-Objekt.
 * @returns {Promise<Object>} Ein Promise, das bei erfolgreicher Anfrage das Freundschaftsanfrage-Objekt zurückgibt.
 * @throws {Object} Bei Fehlern während des Sendens der Anfrage wird ein Fehler-Objekt zurückgegeben.
 */
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

        // Suche nach ALLEN existierenden Freundschaftsanfragen zwischen den Benutzern
        const allRequests = await Friend.find({
            $or: [
                { userId: userId, friendId: friend._id },
                { userId: friend._id, friendId: userId },
            ],
        });

        logger.info(
            `Gefundene Anfragen zwischen ${userId} und ${
                friend._id
            }: ${JSON.stringify(allRequests)}`
        );

        // Wenn Anfragen existieren, prüfe deren Status
        if (allRequests.length > 0) {
            const latestRequest = allRequests[allRequests.length - 1];
            logger.info(`Letzte Anfrage Status: ${latestRequest.status}`);

            // Wenn die letzte Anfrage abgelehnt wurde, lösche alle alten Anfragen
            if (latestRequest.status === 'declined') {
                logger.info('Lösche alte abgelehnte Anfragen...');
                await Friend.deleteMany({
                    $or: [
                        { userId: userId, friendId: friend._id },
                        { userId: friend._id, friendId: userId },
                    ],
                });
            } else if (['pending', 'accepted'].includes(latestRequest.status)) {
                logger.warn(
                    `Aktive Anfrage gefunden mit Status: ${latestRequest.status}`
                );
                return res
                    .status(400)
                    .json({ error: texts.ERRORS.FRIEND_REQUEST_ALREADY_SENT });
            }
        }

        // Erstelle neue Freundschaftsanfrage
        logger.info('Erstelle neue Freundschaftsanfrage...');
        const friendRequest = new Friend({ userId, friendId: friend._id });
        await friendRequest.save();
        logger.info(texts.INFO.FRIEND_REQUEST_SAVED(userId, friend._id));

        const notification = await createNotification({
            userId: friend._id,
            title: texts.MESSAGES.FRIEND_REQUEST_TITEl,
            message: texts.MESSAGES.FRIEND_REQUEST_NOTIFICATION(user.username),
            link: '/friends',
        });

        friendRequest.notificationId = notification._id;
        await friendRequest.save();

        res.status(201).json(friendRequest);
    } catch (error) {
        logger.error(texts.ERRORS.ERROR('sending friend request', error));
        res.status(500).json({ error: texts.ERRORS.SEND_FRIEND_REQUEST });
    }
};

/**
 * Akzeptiert eine Freundschaftsanfrage.
 *
 * @param {Object} req - Das Express-Request-Objekt.
 * @param {Object} req.params - Die Parameter der Anfrage.
 * @param {string} req.params.requestId - Die ID der Freundschaftsanfrage.
 * @param {Object} res - Das Express-Response-Objekt.
 * @returns {Promise<Object>} Ein Promise, das bei erfolgreicher Akzeptierung das aktualisierte Freundschaftsanfrage-Objekt zurückgibt.
 * @throws {Object} Bei Fehlern während der Akzeptierung wird ein Fehler-Objekt zurückgegeben.
 */
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

        // Benachrichtigung für den ursprünglichen Absender
        await createNotification({
            userId: friendRequest.userId,
            title: 'Freundschaftsanfrage akzeptiert',
            message: `${friend.username} hat deine Freundschaftsanfrage angenommen.`,
            link: '/friends',
        });

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

/**
 * Lehnt eine Freundschaftsanfrage ab.
 *
 * @param {Object} req - Das Express-Request-Objekt.
 * @param {Object} req.params - Die Parameter der Anfrage.
 * @param {string} req.params.requestId - Die ID der Freundschaftsanfrage.
 * @param {Object} res - Das Express-Response-Objekt.
 * @returns {Promise<Object>} Ein Promise, das bei erfolgreicher Ablehnung das aktualisierte Freundschaftsanfrage-Objekt zurückgibt.
 * @throws {Object} Bei Fehlern während der Ablehnung wird ein Fehler-Objekt zurückgegeben.
 */
const declineFriendRequest = async (req, res) => {
    const { requestId } = req.params;
    try {
        logger.info(texts.INFO.DECLINING_FRIEND_REQUEST(requestId));
        const friendRequest = await Friend.findById(requestId);
        if (!friendRequest) {
            return res
                .status(404)
                .json({ error: texts.ERRORS.FRIEND_REQUEST_NOT_FOUND });
        }

        // Lösche die Freundschaftsanfrage anstatt sie auf 'declined' zu setzen
        await Friend.deleteOne({ _id: requestId });

        const user = await User.findById(friendRequest.userId);
        const friend = await User.findById(friendRequest.friendId);

        // Benachrichtigung für den ursprünglichen Absender
        await createNotification({
            userId: friendRequest.userId,
            title: 'Freundschaftsanfrage abgelehnt',
            message: `${friend.username} hat deine Freundschaftsanfrage abgelehnt.`,
            link: '/friends',
        });

        logger.info(texts.SUCCESS.FRIEND_REQUEST_DECLINED);
        res.status(200).json({
            message: 'Freundschaftsanfrage erfolgreich abgelehnt',
        });
    } catch (error) {
        logger.error(texts.ERRORS.ERROR('declining friend request', error));
        res.status(500).json({ error: texts.ERRORS.DECLINE_FRIEND_REQUEST });
    }
};

/**
 * Ruft die Freunde eines Benutzers ab.
 *
 * @param {Object} req - Das Express-Request-Objekt.
 * @param {Object} req.params - Die Parameter der Anfrage.
 * @param {string} req.params.userId - Die ID des Benutzers.
 * @param {Object} res - Das Express-Response-Objekt.
 * @returns {Promise<Array>} Ein Promise, das bei Erfolg ein Array von Freunden zurückgibt.
 * @throws {Object} Bei Fehlern während des Abrufens wird ein Fehler-Objekt zurückgegeben.
 */
const getFriends = async (req, res) => {
    const { userId } = req.params;
    try {
        logger.info(texts.INFO.FETCHING_FRIENDS(userId));
        const friends = await Friend.find({
            userId,
            status: 'accepted',
        }).populate('friendId');
        logger.info(texts.SUCCESS.FRIENDS_LOADED);
        res.status(200).json(friends);
    } catch (error) {
        logger.error(texts.ERRORS.ERROR('fetching friends', error));
        res.status(500).json({ error: texts.ERRORS.FETCH_FRIENDS });
    }
};

/**
 * Ruft die ausstehenden Freundschaftsanfragen eines Benutzers ab.
 *
 * @param {Object} req - Das Express-Request-Objekt.
 * @param {Object} req.params - Die Parameter der Anfrage.
 * @param {string} req.params.userId - Die ID des Benutzers.
 * @param {Object} res - Das Express-Response-Objekt.
 * @returns {Promise<Array>} Ein Promise, das bei Erfolg ein Array von ausstehenden Freundschaftsanfragen zurückgibt.
 * @throws {Object} Bei Fehlern während des Abrufens wird ein Fehler-Objekt zurückgegeben.
 */
const getFriendRequests = async (req, res) => {
    const { userId } = req.params;
    try {
        logger.info(texts.INFO.FETCHING_FRIEND_REQUESTS(userId));
        const friendRequests = await Friend.find({
            friendId: userId,
            status: 'pending',
        }).populate('userId');
        logger.info(texts.SUCCESS.FRIEND_REQUESTS_LOADED);
        res.status(200).json(friendRequests);
    } catch (error) {
        logger.error(texts.ERRORS.ERROR('fetching friend requests', error));
        res.status(500).json({ error: texts.ERRORS.FETCH_FRIEND_REQUESTS });
    }
};

/**
 * Löscht eine Freundschaft zwischen zwei Benutzern.
 *
 * @param {Object} req - Das Express-Request-Objekt.
 * @param {Object} req.params - Die Parameter der Anfrage.
 * @param {string} req.params.userId - Die ID des ersten Benutzers.
 * @param {string} req.params.friendId - Die ID des zweiten Benutzers (Freund).
 * @param {Object} res - Das Express-Response-Objekt.
 * @returns {Promise<Object>} Ein Promise, das bei erfolgreicher Löschung eine Erfolgsmeldung zurückgibt.
 * @throws {Object} Bei Fehlern während der Löschung wird ein Fehler-Objekt zurückgegeben.
 */
const deleteFriend = async (req, res) => {
    const { userId, friendId } = req.params;
    try {
        logger.info(texts.INFO.DELETING_FRIENDSHIP(userId, friendId));
        await Friend.deleteOne({ userId, friendId });
        await Friend.deleteOne({ userId: friendId, friendId: userId });

        const user = await User.findById(userId);
        const friend = await User.findById(friendId);

        // Benachrichtigungen für beide Benutzer
        await createNotification({
            userId: friendId,
            title: 'Freundschaft beendet',
            message: `${user.username} hat die Freundschaft beendet.`,
            link: '/friends',
        });

        await createNotification({
            userId: userId,
            title: 'Freundschaft beendet',
            message: `${friend.username} wurde aus deiner Freundesliste entfernt.`,
            link: '/friends',
        });

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
