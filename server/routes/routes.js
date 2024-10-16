const express = require('express');
const router = express.Router();
const cors = require('cors');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Import der Controller-Funktionen
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
    getPublicGoalsOfFriend,
    pinGoal,
    pinFriendGoal,
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
    getAllNotifications,
} = require('../controllers/notificationController');

/**
 * CORS-Konfiguration
 * Erlaubt Anfragen nur von http://localhost:3000
 */
router.use(
    cors({
        credentials: true,
        origin: ['http://localhost:3000'],
    })
);

/**
 * Authentifizierungs-Routen
 */
// Registrierung eines neuen Benutzers
router.post('/register', registerUser);
// Anmeldung eines Benutzers
router.post('/login', loginUser);
// Abmeldung eines Benutzers
router.post('/logout', logoutUser);
// Abrufen des Benutzerprofils
router.get('/profile', getProfile);
// Aktualisieren des Benutzerprofils (inkl. Avatar-Upload)
router.put('/profile', upload.single('avatar'), updateProfile);
// Ändern des Benutzerpassworts
router.put('/change-password', changePassword);

/**
 * Benachrichtigungs-Routen
 */
// Abrufen aller ungelesenen Benachrichtigungen eines Benutzers
router.get('/notifications/:userId', getNotifications);
// Markieren einer Benachrichtigung als gelesen
router.patch('/notifications/:notificationId/read', markNotificationAsRead);
// Abrufen aller Benachrichtigungen eines Benutzers (mit Pagination)
router.get('/notifications/all/:userId', getAllNotifications);

/**
 * Ziel-Routen
 */
// Abrufen öffentlicher Ziele von Freunden
router.get('/goals/friends/:userId', getPublicGoalsOfFriends);
// Hinzufügen eines neuen Ziels
router.post('/goals', addGoal);
// Abrufen aller Ziele eines Benutzers
router.get('/goals', getGoals);
// Löschen eines Ziels
router.delete('/goals/:id', deleteGoal);
// Aktualisieren eines Ziels
router.put('/goals/:id', updateGoal);
// Abrufen öffentlicher Ziele eines bestimmten Freundes
router.get('/goals/friend/:friendId', getPublicGoalsOfFriend);
// Anpinnen eines Ziels
router.post('/goals/pin', pinGoal);
// Anpinnen eines Freundes-Ziels
router.post('/goals/pin-friend', pinFriendGoal);

/**
 * Freundschafts-Routen
 */
// Senden einer Freundschaftsanfrage
router.post('/friends/send', sendFriendRequest);
// Akzeptieren einer Freundschaftsanfrage
router.put('/friends/accept/:requestId', acceptFriendRequest);
// Ablehnen einer Freundschaftsanfrage
router.put('/friends/decline/:requestId', declineFriendRequest);
// Abrufen aller Freunde eines Benutzers
router.get('/friends/:userId', getFriends);
// Abrufen aller Freundschaftsanfragen eines Benutzers
router.get('/friends/requests/:userId', getFriendRequests);
// Löschen einer Freundschaft
router.delete('/friends/:userId/:friendId', deleteFriend);

module.exports = router;
