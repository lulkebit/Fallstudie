// Importiert benötigte Module und Hilfsfunktionen:
// - User-Modell für Datenbankoperationen
// - Funktionen zum Hashen und Vergleichen von Passwörtern
// - JWT (JSON Web Token) zur Authentifizierung und Token-Erstellung
const User = require('../models/user');
const { hashPassword, comparePassword } = require('../helpers/auth');
const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

/**
 * Funktion zur Registrierung eines neuen Benutzers
 * @param {Object} req - Anfrage-Objekt, das die Benutzerdaten enthält (z.B. username, email, password, firstname, lastname)
 * @param {Object} res - Antwort-Objekt zum Senden der Ergebnisse an den Client
 */
const registerUser = async (req, res) => {
    try {
        // Destrukturiere die relevanten Felder aus dem Anfragenkörper
        const { firstname, lastname, email, username, password } = req.body;

        // Überprüfe, ob die E-Mail bereits existiert
        const emailExist = await User.findOne({ email });
        if (emailExist) {
            return res.json({
                error: 'Email wird bereits verwendet',
            });
        }

        // Überprüfe, ob der Benutzername bereits existiert
        const usernameExist = await User.findOne({ username });
        if (usernameExist) {
            return res.json({
                error: 'Username wird bereits verwendet',
            });
        }

        // Überprüfe, ob das Passwort gültig ist (mindestens 6 Zeichen)
        if (!password || password.length < 6) {
            return res.json({
                error: 'Passwort muss mindestens 6 Zeichen lang sein',
            });
        }

        // Überprüfe, ob sowohl Vorname als auch Nachname angegeben wurden
        if (!firstname || !lastname) {
            return res.json({
                error: 'Bitte geben Sie Ihren Vor- und Nachnamen ein',
            });
        }

        // Hash das Passwort, bevor es in der Datenbank gespeichert wird
        const hashedPassword = await hashPassword(password);

        // Erstelle einen neuen Benutzer mit den bereitgestellten und validierten Daten
        const user = await User.create({
            username,
            email,
            password: hashedPassword, // Speichere das gehashte Passwort
            firstname,
            lastname,
        });

        // Sende den erstellten Benutzer als JSON-Antwort zurück
        return res.json(user);
    } catch (error) {
        // Fehlerbehandlung im Fall eines Fehlers
        res.status(500).json({ message: error.message });
    }
};

/**
 * Funktion zur Anmeldung eines Benutzers
 * @param {Object} req - Anfrage-Objekt, das die Benutzerdaten enthält (z.B. email, password)
 * @param {Object} res - Antwort-Objekt zum Senden der Ergebnisse an den Client
 */
const loginUser = async (req, res) => {
    // TODO login mit Username
    try {
        // Destrukturiere E-Mail und Passwort aus dem Anfragenkörper
        const { email, password } = req.body;

        // Suche nach einem Benutzer mit der angegebenen E-Mail-Adresse
        const user = await User.findOne({ email });
        if (!user) {
            // Wenn kein Benutzer gefunden wird, gib eine Fehlermeldung zurück
            return res.json({
                error: 'Ungültige Anmeldedaten',
            });
        }

        // Vergleiche das eingegebene Passwort mit dem in der Datenbank gehashten Passwort
        const match = await comparePassword(password, user.password);
        if (match) {
            // Wenn das Passwort korrekt ist, erstelle ein JWT-Token
            jwt.sign(
                {
                    username: user.username,
                    email: user.email,
                    id: user._id,
                    firstname: user.firstname,
                    lastname: user.lastname,
                },
                'idsfu&ASUDIhiedUioGYUYFHIUGTygbhbhY3427HS', // Verwende das geheime JWT-Schlüssel
                {},
                (err, token) => {
                    if (err) {
                        // Fehlerbehandlung, falls Token-Erstellung fehlschlägt
                        return res
                            .status(500)
                            .json({ error: 'Token-Erstellung fehlgeschlagen' });
                    }

                    // Wenn erfolgreich, sende das Token als Cookie und Benutzerinfo zurück
                    res.cookie('token', token, {
                        httpOnly: true, // Das Cookie ist nur für den Server zugänglich
                        secure: true, // Cookie wird nur über HTTPS gesendet
                    }).json(user);
                }
            );
        } else {
            // Wenn das Passwort falsch ist, gib eine Fehlermeldung zurück
            return res.json({
                error: 'Ungültige Anmeldedaten',
            });
        }
    } catch (error) {
        // Fehlerbehandlung im Fall eines Fehlers
        res.status(500).json({ message: error.message });
    }
};

/**
 * Funktion um Profil eines Benutzers aus einem JWT (JSON Web Token) abzurufen.
 * @param {Object} req - Anfrage-Objekt, das die Benutzerdaten enthält (z.B. email, password)
 * @param {Object} res - Antwort-Objekt zum Senden der Ergebnisse an den Client
 */
const getProfile = (req, res) => {
    // Extrahiert das Token aus den Cookies der Anfrage
    const { token } = req.cookies;

    // Überprüft, ob ein Token vorhanden ist
    if (token) {
        // Verifiziert das Token mit jwt.verify
        jwt.verify(
            token,
            'idsfu&ASUDIhiedUioGYUYFHIUGTygbhbhY3427HS',
            {},
            (err, user) => {
                // Wenn ein Fehler bei der Verifizierung auftritt (z.B. ungültiges Token)
                if (err) {
                    // Sendet eine Antwort mit einem Fehlerobjekt zurück
                    return res.json({ error: 'Invalid token' });
                }
                // Wenn das Token gültig ist, sendet es die Benutzerdaten als JSON zurück
                res.json(user);
            }
        );
    } else {
        // Wenn kein Token gefunden wird, sendet es eine einfache Nachricht zurück
        res.json('No token found');
    }
};

const addCard = async (req, res) => {
    const { userId, card } = req.body;
    try {
        logger.info('Hinzufügen einer neuen Karte für Benutzer:', userId);
        const user = await User.findById(userId);
        if (!user) {
            logger.warn('Benutzer nicht gefunden:', userId);
            return res.status(404).json({ error: 'Benutzer nicht gefunden' });
        }
        user.cards.push(card);
        await user.save();
        logger.info('Karte hinzugefügt:', card);
        res.status(200).json(user.cards);
    } catch (error) {
        logger.error('Fehler beim Hinzufügen der Karte:', error);
        res.status(500).json({ error: 'Fehler beim Hinzufügen der Karte' });
    }
};

const getCards = async (req, res) => {
    const { userId } = req.query;
    try {
        logger.info('Abrufen der Karten für Benutzer:', userId);
        const user = await User.findById(userId);
        if (!user) {
            logger.warn('Benutzer nicht gefunden:', userId);
            return res.status(404).json({ error: 'Benutzer nicht gefunden' });
        }
        logger.info('Karten gefunden:', user.cards);
        res.status(200).json(user.cards);
    } catch (error) {
        logger.error('Fehler beim Abrufen der Karten:', error);
        res.status(500).json({ error: 'Fehler beim Abrufen der Karten' });
    }
};

const deleteCard = async (req, res) => {
    const { userId } = req.body;
    const { id } = req.params;
    try {
        logger.info('Löschen der Karte mit ID:', id, 'für Benutzer:', userId);
        const user = await User.findById(userId);
        if (!user) {
            logger.warn('Benutzer nicht gefunden:', userId);
            return res.status(404).json({ error: 'Benutzer nicht gefunden' });
        }
        user.cards = user.cards.filter((card) => card.id !== parseInt(id));
        await user.save();
        logger.info('Karte gelöscht:', id);
        res.status(200).json(user.cards);
    } catch (error) {
        logger.error('Fehler beim Löschen der Karte:', error);
        res.status(500).json({ error: 'Fehler beim Löschen der Karte' });
    }
};

const updateCard = async (req, res) => {
    const { userId, card } = req.body;
    const { id } = req.params;
    try {
        logger.info(`Aktualisiere Karte mit ID ${id} für Benutzer ${userId}`);
        const user = await User.findById(userId);
        if (!user) {
            logger.warn(`Benutzer mit ID ${userId} nicht gefunden`);
            return res.status(404).json({ error: 'Benutzer nicht gefunden' });
        }
        const cardIndex = user.cards.findIndex((c) => c.id === parseInt(id));
        if (cardIndex === -1) {
            logger.warn(`Karte mit ID ${id} nicht gefunden`);
            return res.status(404).json({ error: 'Karte nicht gefunden' });
        }
        user.cards[cardIndex] = card;
        await user.save();
        logger.info(`Karte mit ID ${id} erfolgreich aktualisiert`);
        res.status(200).json(user.cards);
    } catch (error) {
        logger.error('Fehler beim Aktualisieren der Karte:', error);
        res.status(500).json({ error: 'Fehler beim Aktualisieren der Karte' });
    }
};

// Exportiere die Funktionen für die Benutzerregistrierung und -anmeldung
module.exports = {
    registerUser,
    loginUser,
    getProfile,
    addCard,
    getCards,
    deleteCard,
    updateCard,
};
