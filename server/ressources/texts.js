module.exports = {
    ERRORS: {
        ERROR: (type, error) => `Error during ${type}: ${error}`,
        TOKEN_CREATION_CLIENT: 'Token creation failed',
        USER_PROFILE_RETRIEVAL: 'Error retrieving user profile',
        PROFILE_UPDATE: 'Fehler beim Aktualisieren des Profils',
        PASSWORD_CHANGE: 'Fehler beim Ändern des Passworts',
        USER_NOT_FOUND: 'User not found',
        FRIEND_REQUEST_SELF: 'You cannot send a friend request to yourself',
        FRIEND_REQUEST_ALREADY_SENT: 'Friend request already sent',
        FRIEND_REQUEST_NOT_FOUND: 'Friend request not found',
        SEND_FRIEND_REQUEST: 'Error sending friend request',
        ACCEPT_FRIEND_REQUEST: 'Error accepting friend request',
        DECLINE_FRIEND_REQUEST: 'Error declining friend request',
        FETCH_FRIENDS: 'Error fetching friends',
        FETCH_FRIEND_REQUESTS: 'Error fetching friend requests',
        DELETE_FRIENDSHIP: 'Error deleting friendship',
        ADD_GOAL: 'Fehler beim Hinzufügen des Ziels',
        FETCH_GOALS: 'Fehler beim Abrufen der Ziele',
        DELETE_GOAL: 'Fehler beim Löschen des Ziels',
        UPDATE_GOAL: 'Fehler beim Aktualisieren des Ziels',
        GOAL_NOT_FOUND: 'Ziel nicht gefunden',
        FETCH_PUBLIC_GOALS: 'Error retrieving public goals of friends',
        FETCH_NOTIFICATIONS: 'Error fetching notifications',
        MARK_NOTIFICATION_READ: 'Error marking notification as read',
        NOTIFICATION_NOT_FOUND: 'Notification not found',
    },
    SUCCESS: {
        SERVER_RUNNING: (port) => `Server is running on port ${port}`,
        USER_REGISTERED: (username) =>
            `User registered successfully: ${username}`,
        USER_LOGGED_IN: (username) =>
            `User logged in successfully: ${username}`,
        USER_LOGGED_OUT: 'User logged out',
        PASSWORD_CHANGED: 'Passwort erfolgreich geändert',
        FRIEND_REQUEST_SENT: 'Friend request sent successfully',
        FRIEND_REQUEST_ACCEPTED: 'Friend request accepted successfully',
        FRIEND_REQUEST_DECLINED: 'Friend request declined successfully',
        FRIENDSHIP_DELETED: 'Friendship deleted successfully',
        GOAL_ADDED: 'Ziel erfolgreich hinzugefügt',
        GOAL_DELETED: 'Ziel erfolgreich gelöscht',
        GOAL_UPDATED: 'Ziel erfolgreich aktualisiert',
        NOTIFICATION_MARKED_READ: 'Notification marked as read successfully',
    },
    INFO: {
        ATTEMPTING_REGISTER_USER: 'Attempting to register a new user',
        ATTEMPTING_LOGIN_USER: 'Attempting to log in user',
        ATTEMPTING_LOGOUT_USER: 'Attempting user logout',
        ATTEMPTING_PROFILE_RETRIEVAL: 'Attempting to retrieve user profile',
        ATTEMPTING_PROFILE_UPDATE: (userId) =>
            `Attempting to update profile for user ID: ${userId}`,
        ATTEMPTING_PASSWORD_CHANGE: (userId) =>
            `User ${userId} is attempting to change password`,
        PROFILE_FIELD_CHANGED: (userId, field, oldValue, newValue) =>
            `User ID: ${userId} - ${field} changed from '${oldValue}' to '${newValue}'`,
        SENDING_FRIEND_REQUEST: (userId, friendUsername) =>
            `User ${userId} is sending a friend request to ${friendUsername}`,
        FRIEND_REQUEST_SAVED: (userId, friendId) =>
            `Friend request from ${userId} to ${friendId} saved successfully`,
        ACCEPTING_FRIEND_REQUEST: (requestId) =>
            `Accepting friend request with ID ${requestId}`,
        DECLINING_FRIEND_REQUEST: (requestId) =>
            `Declining friend request with ID ${requestId}`,
        FETCHING_FRIENDS: (userId) => `Fetching friends for user ${userId}`,
        FETCHING_FRIEND_REQUESTS: (userId) =>
            `Fetching friend requests for user ${userId}`,
        DELETING_FRIENDSHIP: (userId, friendId) =>
            `Deleting friendship between ${userId} and ${friendId}`,
        ADDING_GOAL: (userId) =>
            `Hinzufügen eines neuen Ziels für Benutzer: ${userId}`,
        FETCHING_GOALS: (userId) => `Abrufen der Ziele für Benutzer: ${userId}`,
        DELETING_GOAL: (id, userId) =>
            `Löschen des Ziels mit ID: ${id} für Benutzer: ${userId}`,
        UPDATING_GOAL: (id, userId) =>
            `Aktualisiere Ziel mit ID ${id} für Benutzer ${userId}`,
        FETCHING_PUBLIC_GOALS: (userId) =>
            `Fetching public goals for user: ${userId}`,
        PUBLIC_GOALS_RETRIEVED: (count, userId) =>
            `Retrieved ${count} public goals for user ${userId}`,
        NOTIFICATION_MARKED_READ: (notificationId) =>
            `Marked notification ${notificationId} as read`,
    },
    WARNINGS: {
        EMAIL_ALREADY_EXISTS_SERVER: (email) =>
            `Registration failed: Email ${email} already in use`,
        EMAIL_ALREADY_EXISTS_CLIENT: 'Email already in use',
        USERNAME_ALREADY_EXISTS_SERVER: (username) =>
            `Registration failed: Username ${username} already in use`,
        USERNAME_ALREADY_EXISTS_CLIENT: 'Username already in use',
        PASSWORD_TOO_SHORT: 'Password must be at least 6 characters long',
        NAME_MISSING_SERVER: 'Missing first or last name',
        NAME_MISSING_CLIENT: 'Bitte geben Sie Ihren Vor- und Nachnamen ein',
        WRONG_EMAIL_SERVER: (email) =>
            `Login failed: No user found with email ${email}`,
        WRONG_PASSWORD_SERVER: (username) =>
            `Login failed: Wrong password for ${username}`,
        WRONG_CREDENTIALS_CLIENT: 'Wrong email or password',
        INVALID_TOKEN: 'Invalid token',
        NO_TOKEN_FOUND: 'No token found',
        USER_NOT_FOUND: 'Benutzer nicht gefunden',
        OLD_PASSWORD_INCORRECT: 'Altes Passwort ist falsch',
        FRIEND_REQUEST_SELF: (username) =>
            `User ${username} cannot send a friend request to himself`,
        FRIEND_REQUEST_ALREADY_EXISTS: (userId, friendId) =>
            `Friend request from ${userId} to ${friendId} already exists`,
        NOTIFICATION_NOT_FOUND: (requestId) =>
            `Notification not found for friend request ${requestId}`,
    },
    MESSAGES: {
        LOGOUT_SUCCESS: 'Erfolgreich abgemeldet',
        FRIEND_REQUEST_NOTIFICATION: (username) =>
            `${username} hat dir eine Freundschaftsanfrage gesendet!`,
    },
};
