module.exports = {
    ERRORS: {
        ERROR: (typ, fehler) => `Fehler während ${typ}: ${fehler}`,
        TOKEN_CREATION_CLIENT: 'Token-Erstellung fehlgeschlagen',
        USER_PROFILE_RETRIEVAL: 'Fehler beim Abrufen des Benutzerprofils',
        PROFILE_UPDATE: 'Fehler beim Aktualisieren des Profils',
        PASSWORD_CHANGE: 'Fehler beim Ändern des Passworts',
        USER_NOT_FOUND: 'Benutzer nicht gefunden',
        FRIEND_REQUEST_SELF:
            'Du kannst dir selbst keine Freundschaftsanfrage senden',
        FRIEND_REQUEST_ALREADY_SENT:
            'Freundschaftsanfrage wurde bereits gesendet',
        FRIEND_REQUEST_NOT_FOUND: 'Freundschaftsanfrage nicht gefunden',
        SEND_FRIEND_REQUEST: 'Fehler beim Senden der Freundschaftsanfrage',
        ACCEPT_FRIEND_REQUEST: 'Fehler beim Annehmen der Freundschaftsanfrage',
        DECLINE_FRIEND_REQUEST: 'Fehler beim Ablehnen der Freundschaftsanfrage',
        FETCH_FRIENDS: 'Fehler beim Abrufen der Freunde',
        FETCH_FRIEND_REQUESTS: 'Fehler beim Abrufen der Freundschaftsanfragen',
        DELETE_FRIENDSHIP: 'Fehler beim Löschen der Freundschaft',
        ADD_GOAL: 'Fehler beim Hinzufügen des Ziels',
        FETCH_GOALS: 'Fehler beim Abrufen der Ziele',
        DELETE_GOAL: 'Fehler beim Löschen des Ziels',
        UPDATE_GOAL: 'Fehler beim Aktualisieren des Ziels',
        GOAL_NOT_FOUND: 'Ziel nicht gefunden',
        FETCH_PUBLIC_GOALS:
            'Fehler beim Abrufen der öffentlichen Ziele von Freunden',
        FETCH_NOTIFICATIONS: 'Fehler beim Abrufen der Benachrichtigungen',
        MARK_NOTIFICATION_READ:
            'Fehler beim Markieren der Benachrichtigung als gelesen',
        NOTIFICATION_NOT_FOUND: 'Benachrichtigung nicht gefunden',
    },
    SUCCESS: {
        SERVER_RUNNING: (port) => `Server läuft auf Port ${port}`,
        USER_REGISTERED: (benutzername) =>
            `Benutzer erfolgreich registriert: ${benutzername}`,
        USER_LOGGED_IN: (benutzername) =>
            `Benutzer erfolgreich angemeldet: ${benutzername}`,
        USER_LOGGED_OUT: 'Benutzer abgemeldet',
        PASSWORD_CHANGED: 'Passwort erfolgreich geändert',
        FRIEND_REQUEST_SENT: 'Freundschaftsanfrage erfolgreich gesendet',
        FRIEND_REQUEST_ACCEPTED: 'Freundschaftsanfrage erfolgreich angenommen',
        FRIEND_REQUEST_DECLINED: 'Freundschaftsanfrage erfolgreich abgelehnt',
        FRIEND_REQUESTS_LOADED: 'Freundschaftsanfragen erfolgreich geladen',
        FRIENDS_LOADED: 'Freunde erfolgreich geladen',
        FRIENDSHIP_DELETED: 'Freundschaft erfolgreich gelöscht',
        GOAL_ADDED: 'Ziel erfolgreich hinzugefügt',
        GOAL_DELETED: 'Ziel erfolgreich gelöscht',
        GOAL_UPDATED: 'Ziel erfolgreich aktualisiert',
        GOAL_LOADED: 'Ziele erfolgreich geladen',
        NOTIFICATION_MARKED_READ:
            'Benachrichtigung erfolgreich als gelesen markiert',
    },
    INFO: {
        ATTEMPTING_REGISTER_USER:
            'Versuch, einen neuen Benutzer zu registrieren',
        ATTEMPTING_LOGIN_USER: 'Versuch, Benutzer anzumelden',
        ATTEMPTING_LOGOUT_USER: 'Versuch, Benutzer abzumelden',
        ATTEMPTING_PROFILE_RETRIEVAL: 'Versuch, Benutzerprofil abzurufen',
        ATTEMPTING_PROFILE_UPDATE: (benutzerId) =>
            `Versuch, Profil für Benutzer-ID zu aktualisieren: ${benutzerId}`,
        ATTEMPTING_PASSWORD_CHANGE: (benutzerId) =>
            `Benutzer ${benutzerId} versucht, das Passwort zu ändern`,
        PROFILE_FIELD_CHANGED: (benutzerId, feld, alterWert, neuerWert) =>
            `Benutzer-ID: ${benutzerId} - ${feld} geändert von '${alterWert}' zu '${neuerWert}'`,
        SENDING_FRIEND_REQUEST: (benutzerId, freundBenutzername) =>
            `Benutzer ${benutzerId} sendet eine Freundschaftsanfrage an ${freundBenutzername}`,
        FRIEND_REQUEST_SAVED: (benutzerId, freundId) =>
            `Freundschaftsanfrage von ${benutzerId} an ${freundId} erfolgreich gespeichert`,
        ACCEPTING_FRIEND_REQUEST: (anfrageId) =>
            `Freundschaftsanfrage mit ID ${anfrageId} wird angenommen`,
        DECLINING_FRIEND_REQUEST: (anfrageId) =>
            `Freundschaftsanfrage mit ID ${anfrageId} wird abgelehnt`,
        FETCHING_FRIENDS: (benutzerId) =>
            `Freunde für Benutzer ${benutzerId} werden abgerufen`,
        FETCHING_FRIEND_REQUESTS: (benutzerId) =>
            `Freundschaftsanfragen für Benutzer ${benutzerId} werden abgerufen`,
        DELETING_FRIENDSHIP: (benutzerId, freundId) =>
            `Freundschaft zwischen ${benutzerId} und ${freundId} wird gelöscht`,
        ADDING_GOAL: (benutzerId) =>
            `Hinzufügen eines neuen Ziels für Benutzer: ${benutzerId}`,
        FETCHING_GOALS: (benutzerId) =>
            `Abrufen der Ziele für Benutzer: ${benutzerId}`,
        DELETING_GOAL: (id, benutzerId) =>
            `Löschen des Ziels mit ID: ${id} für Benutzer: ${benutzerId}`,
        UPDATING_GOAL: (id, benutzerId) =>
            `Aktualisiere Ziel mit ID ${id} für Benutzer ${benutzerId}`,
        FETCHING_PUBLIC_GOALS: (benutzerId) =>
            `Abrufen öffentlicher Ziele für Benutzer: ${benutzerId}`,
        PUBLIC_GOALS_RETRIEVED: (anzahl, benutzerId) =>
            `${anzahl} öffentliche Ziele für Benutzer ${benutzerId} abgerufen`,
        NOTIFICATION_MARKED_READ: (benachrichtigungsId) =>
            `Benachrichtigung ${benachrichtigungsId} als gelesen markiert`,
        FETCHING_NOTIFICATIONS: (benutzerId, seite, limit) =>
            `Abrufen von Benachrichtigungen für Benutzer ${benutzerId} mit Seite ${seite} und Limit ${limit}`,
    },
    WARNINGS: {
        EMAIL_ALREADY_EXISTS_SERVER: (email) =>
            `Registrierung fehlgeschlagen: E-Mail ${email} wird bereits verwendet`,
        EMAIL_ALREADY_EXISTS_CLIENT: 'E-Mail wird bereits verwendet',
        USERNAME_ALREADY_EXISTS_SERVER: (benutzername) =>
            `Registrierung fehlgeschlagen: Benutzername ${benutzername} wird bereits verwendet`,
        USERNAME_ALREADY_EXISTS_CLIENT: 'Benutzername wird bereits verwendet',
        PASSWORD_TOO_SHORT: 'Passwort muss mindestens 6 Zeichen lang sein',
        NAME_MISSING_SERVER: 'Vor- oder Nachname fehlt',
        NAME_MISSING_CLIENT: 'Bitte geben Sie Ihren Vor- und Nachnamen ein',
        WRONG_EMAIL_SERVER: (email) =>
            `Anmeldung fehlgeschlagen: Kein Benutzer mit E-Mail ${email} gefunden`,
        WRONG_PASSWORD_SERVER: (benutzername) =>
            `Anmeldung fehlgeschlagen: Falsches Passwort für ${benutzername}`,
        WRONG_CREDENTIALS_CLIENT: 'Falsche E-Mail oder falsches Passwort',
        INVALID_TOKEN: 'Ungültiges Token',
        NO_TOKEN_FOUND: 'Kein Token gefunden',
        USER_NOT_FOUND: 'Benutzer nicht gefunden',
        OLD_PASSWORD_INCORRECT: 'Altes Passwort ist falsch',
        FRIEND_REQUEST_SELF: (benutzername) =>
            `Benutzer ${benutzername} kann sich selbst keine Freundschaftsanfrage senden`,
        FRIEND_REQUEST_ALREADY_EXISTS: (benutzerId, freundId) =>
            `Freundschaftsanfrage von ${benutzerId} an ${freundId} existiert bereits`,
        NOTIFICATION_NOT_FOUND: (anfrageId) =>
            `Benachrichtigung für Freundschaftsanfrage ${anfrageId} nicht gefunden`,
    },
    MESSAGES: {
        LOGOUT_SUCCESS: 'Erfolgreich abgemeldet',
        FRIEND_REQUEST_TITEl: 'Freundschaftsanfrage',
        FRIEND_REQUEST_NOTIFICATION: (benutzername) =>
            `${benutzername} hat dir eine Freundschaftsanfrage gesendet!`,
    },
    SERVER: {
        RUNNING: (port) => `Server läuft auf Port ${port}`,
        DATABASE_CONNECTED: 'Datenbank verbunden',
    },
};
