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

const {
    addGlobalGoal,
    getGlobalGoals,
    updateGlobalGoal,
    deleteGlobalGoal,
    participateInGlobalGoal,
} = require('../controllers/globalGoalController');

// Import der User-Management-Funktionen
const {
    getAllUsers,
    deleteUser,
    updateUser,
    resetUserPassword,
} = require('../controllers/userController');

// Import der Admin-Goal-Management-Funktionen
const {
    getAllUserGoals,
    updateUserGoal,
    deleteUserGoal,
    getAdminStats,
    getUserGrowthStats,
} = require('../controllers/adminGoalController');

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
 * Globale Ziel-Routen
 */
// Hinzufügen eines neuen globalen Ziels (nur für Admins)
router.post('/global-goals', addGlobalGoal);
// Abrufen aller globalen Ziele
router.get('/global-goals', getGlobalGoals);
// Aktualisieren eines globalen Ziels (nur für Admins)
router.put('/global-goals/:id', updateGlobalGoal);
// Löschen eines globalen Ziels (nur für Admins)
router.delete('/global-goals/:id', deleteGlobalGoal);
// Teilnahme an einem globalen Ziel
router.post('/global-goals/participate/:goalId', participateInGlobalGoal);

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

/**
 * User-Management-Routen (nur für Admins)
 */
// Abrufen aller Benutzer
router.get('/users', getAllUsers);
// Löschen eines Benutzers
router.delete('/users/:id', deleteUser);
// Aktualisieren eines Benutzers
router.put('/users/:id', updateUser);
// Zurücksetzen des Passworts eines Benutzers
router.put('/users/:id/reset-password', resetUserPassword);

/**
 * Admin-Routen
 */
// Abrufen aller Benutzerziele
router.get('/admin/goals', getAllUserGoals);
// Aktualisieren eines Benutzerziels
router.put('/admin/goals/:goalId', updateUserGoal);
// Löschen eines Benutzerziels
router.delete('/admin/goals/:goalId', deleteUserGoal);
// Abrufen der Admin-Statistiken
router.get('/admin/stats', getAdminStats);

router.get('/user-growth', getUserGrowthStats);

module.exports = router;
