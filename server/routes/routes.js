const express = require('express');
const router = express.Router();
const cors = require('cors');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });

const {
    registerUser,
    loginUser,
    logoutUser,
    getProfile,
    updateProfile,
    changePassword,
} = require('../controllers/authController');

const {
    addGoal,
    getGoals,
    deleteGoal,
    updateGoal,
    getPublicGoalsOfFriends,
} = require('../controllers/goalController');

const {
    sendFriendRequest,
    acceptFriendRequest,
    declineFriendRequest,
    getFriends,
    getFriendRequests,
    deleteFriend,
} = require('../controllers/friendController');

const {
    getNotifications,
    markNotificationAsRead,
} = require('../controllers/notificationController');

router.use(
    cors({
        credentials: true,
        origin: ['http://localhost:3000'],
    })
);

// Auth routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.get('/profile', getProfile);
router.put('/profile', upload.single('avatar'), updateProfile);
router.put('/change-password', changePassword);

// Notification routes
router.get('/notifications/:userId', getNotifications);
router.patch('/notifications/:notificationId/read', markNotificationAsRead);

// Goal routes
router.get('/goals/friends/:userId', getPublicGoalsOfFriends);
router.post('/goals', addGoal);
router.get('/goals', getGoals);
router.delete('/goals/:id', deleteGoal);
router.put('/goals/:id', updateGoal);

// Friend routes
router.post('/friends/send', sendFriendRequest);
router.put('/friends/accept/:requestId', acceptFriendRequest);
router.put('/friends/decline/:requestId', declineFriendRequest);
router.get('/friends/:userId', getFriends);
router.get('/friends/requests/:userId', getFriendRequests);
router.delete('/friends/:userId/:friendId', deleteFriend);

module.exports = router;
