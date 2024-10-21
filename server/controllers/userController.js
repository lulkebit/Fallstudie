const User = require('../models/user');
const logger = require('../utils/logger');
const texts = require('../ressources/texts');
const { hashPassword } = require('../helpers/auth');

/**
 * Ruft Benutzer aus der Datenbank ab mit Unterstützung für Paginierung und Suche.
 *
 * @param {Object} req - Das Express-Request-Objekt.
 * @param {Object} req.query - Die Query-Parameter der Anfrage.
 * @param {number} [req.query.page=1] - Die aktuelle Seitennummer.
 * @param {number} [req.query.limit=10] - Die Anzahl der Benutzer pro Seite.
 * @param {string} [req.query.search] - Der Suchbegriff für Benutzername oder E-Mail.
 * @param {Object} res - Das Express-Response-Objekt.
 * @returns {Promise<Object>} Ein Promise, das bei Erfolg ein Objekt mit Benutzern und Paginierungsinformationen zurückgibt.
 * @throws {Object} Bei Fehlern wird ein Fehler-Objekt zurückgegeben.
 */
const getAllUsers = async (req, res) => {
    try {
        logger.info(texts.INFO.ATTEMPTING_FETCH_ALL_USERS);

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || '';

        const skip = (page - 1) * limit;

        const searchQuery = search
            ? {
                  $or: [
                      { username: { $regex: search, $options: 'i' } },
                      { email: { $regex: search, $options: 'i' } },
                  ],
              }
            : {};

        const users = await User.find(searchQuery, '-password')
            .skip(skip)
            .limit(limit);

        const totalUsers = await User.countDocuments(searchQuery);
        const totalPages = Math.ceil(totalUsers / limit);

        logger.info(texts.SUCCESS.USERS_FETCHED(users.length));
        res.json({
            users,
            currentPage: page,
            totalPages,
            totalUsers,
        });
    } catch (error) {
        logger.error(texts.ERRORS.ERROR('fetching users', error));
        res.status(500).json({ message: texts.ERRORS.USERS_FETCH });
    }
};

/**
 * Löscht einen Benutzer aus der Datenbank.
 *
 * @param {Object} req - Das Express-Request-Objekt.
 * @param {Object} req.params - Die Parameter der Anfrage.
 * @param {string} req.params.id - Die ID des zu löschenden Benutzers.
 * @param {Object} res - Das Express-Response-Objekt.
 * @returns {Promise<Object>} Ein Promise, das bei erfolgreicher Löschung eine Erfolgsmeldung zurückgibt.
 * @throws {Object} Bei Fehlern während der Löschung wird ein Fehler-Objekt zurückgegeben.
 */
const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        logger.info(texts.INFO.ATTEMPTING_DELETE_USER(userId));

        const user = await User.findById(userId);
        if (!user) {
            logger.warn(texts.WARNINGS.USER_NOT_FOUND);
            return res
                .status(404)
                .json({ error: texts.WARNINGS.USER_NOT_FOUND });
        }

        await User.findByIdAndDelete(userId);
        logger.info(texts.SUCCESS.USER_DELETED(userId));
        res.json({ message: texts.SUCCESS.USER_DELETED(userId) });
    } catch (error) {
        logger.error(texts.ERRORS.ERROR('deleting user', error));
        res.status(500).json({ message: texts.ERRORS.USER_DELETE });
    }
};

/**
 * Aktualisiert die Informationen eines Benutzers in der Datenbank.
 *
 * @param {Object} req - Das Express-Request-Objekt.
 * @param {Object} req.params - Die Parameter der Anfrage.
 * @param {string} req.params.id - Die ID des zu aktualisierenden Benutzers.
 * @param {Object} req.body - Die aktualisierten Benutzerdaten.
 * @param {Object} res - Das Express-Response-Objekt.
 * @returns {Promise<Object>} Ein Promise, das bei erfolgreicher Aktualisierung den aktualisierten Benutzer zurückgibt.
 * @throws {Object} Bei Fehlern während der Aktualisierung wird ein Fehler-Objekt zurückgegeben.
 */
const updateUser = async (req, res) => {
    try {
        const userId = req.params.id;
        logger.info(texts.INFO.ATTEMPTING_UPDATE_USER(userId));

        const { email, username, firstName, lastName } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            logger.warn(texts.WARNINGS.USER_NOT_FOUND);
            return res
                .status(404)
                .json({ error: texts.WARNINGS.USER_NOT_FOUND });
        }

        // Check if email or username already exist for another user
        const existingUser = await User.findOne({
            $or: [
                { email: email, _id: { $ne: userId } },
                { username: username, _id: { $ne: userId } },
            ],
        });

        if (existingUser) {
            logger.warn(texts.WARNINGS.USER_ALREADY_EXISTS);
            return res
                .status(400)
                .json({ error: texts.WARNINGS.USER_ALREADY_EXISTS });
        }

        user.email = email;
        user.username = username;
        user.firstname = firstName;
        user.lastname = lastName;

        const updatedUser = await user.save();
        logger.info(texts.SUCCESS.USER_UPDATED(userId));
        res.json(updatedUser);
    } catch (error) {
        logger.error(texts.ERRORS.ERROR('updating user', error));
        logger.error('Detailed error:', error.message, error.stack);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: texts.ERRORS.USER_UPDATE });
    }
};

/**
 * Setzt das Passwort eines Benutzers zurück.
 *
 * @param {Object} req - Das Express-Request-Objekt.
 * @param {Object} req.params - Die Parameter der Anfrage.
 * @param {string} req.params.id - Die ID des Benutzers, dessen Passwort zurückgesetzt werden soll.
 * @param {Object} req.body - Der Körper der Anfrage.
 * @param {string} req.body.newPassword - Das neue Passwort für den Benutzer.
 * @param {Object} res - Das Express-Response-Objekt.
 * @returns {Promise<Object>} Ein Promise, das bei erfolgreicher Zurücksetzung eine Erfolgsmeldung zurückgibt.
 * @throws {Object} Bei Fehlern während der Passwort-Zurücksetzung wird ein Fehler-Objekt zurückgegeben.
 */
const resetUserPassword = async (req, res) => {
    try {
        const userId = req.params.id;
        const { newPassword } = req.body;

        logger.info(texts.INFO.ATTEMPTING_RESET_USER_PASSWORD(userId));

        const user = await User.findById(userId);
        if (!user) {
            logger.warn(texts.WARNINGS.USER_NOT_FOUND);
            return res
                .status(404)
                .json({ error: texts.WARNINGS.USER_NOT_FOUND });
        }

        user.password = await hashPassword(newPassword);
        await user.save();

        logger.info(texts.SUCCESS.USER_PASSWORD_RESET(userId));
        res.json({ message: texts.SUCCESS.USER_PASSWORD_RESET(userId) });
    } catch (error) {
        logger.error(texts.ERRORS.ERROR('resetting user password', error));
        res.status(500).json({ message: texts.ERRORS.USER_PASSWORD_RESET });
    }
};

module.exports = {
    getAllUsers,
    deleteUser,
    updateUser,
    resetUserPassword,
};
