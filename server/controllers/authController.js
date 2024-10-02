const User = require('../models/user');
const { hashPassword, comparePassword } = require('../helpers/auth');
const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

const registerUser = async (req, res) => {
    try {
        logger.info('Attempting to register a new user');
        const { firstname, lastname, email, username, password } = req.body;

        const emailExist = await User.findOne({ email });
        if (emailExist) {
            logger.warn(`Registration failed: Email ${email} already in use`);
            return res.json({
                error: 'Email wird bereits verwendet',
            });
        }

        const usernameExist = await User.findOne({ username });
        if (usernameExist) {
            logger.warn(
                `Registration failed: Username ${username} already in use`
            );
            return res.json({
                error: 'Username wird bereits verwendet',
            });
        }

        if (!password || password.length < 6) {
            logger.warn('Registration failed: Password too short');
            return res.json({
                error: 'Passwort muss mindestens 6 Zeichen lang sein',
            });
        }

        if (!firstname || !lastname) {
            logger.warn('Registration failed: Missing first or last name');
            return res.json({
                error: 'Bitte geben Sie Ihren Vor- und Nachnamen ein',
            });
        }

        const hashedPassword = await hashPassword(password);

        const user = await User.create({
            username,
            email,
            password: hashedPassword,
            firstname,
            lastname,
        });

        logger.info(`User registered successfully: ${username}`);
        return res.json(user);
    } catch (error) {
        logger.error('Error during user registration:', error);
        res.status(500).json({ message: error.message });
    }
};

const loginUser = async (req, res) => {
    try {
        logger.info('Attempting user login');
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            logger.warn(`Login failed: No user found with email ${email}`);
            return res.json({
                error: 'Ungültige Anmeldedaten',
            });
        }

        const match = await comparePassword(password, user.password);
        if (match) {
            jwt.sign(
                {
                    username: user.username,
                    email: user.email,
                    id: user._id,
                    firstname: user.firstname,
                    lastname: user.lastname,
                },
                'idsfu&ASUDIhiedUioGYUYFHIUGTygbhbhY3427HS',
                {},
                (err, token) => {
                    if (err) {
                        logger.error('Token creation failed:', err);
                        return res
                            .status(500)
                            .json({ error: 'Token-Erstellung fehlgeschlagen' });
                    }

                    logger.info(
                        `User logged in successfully: ${user.username}`
                    );
                    res.cookie('token', token, {
                        httpOnly: true,
                        secure: true,
                    }).json(user);
                }
            );
        } else {
            logger.warn(
                `Login failed: Incorrect password for user ${user.username}`
            );
            return res.json({
                error: 'Ungültige Anmeldedaten',
            });
        }
    } catch (error) {
        logger.error('Error during user login:', error);
        res.status(500).json({ message: error.message });
    }
};

const getProfile = (req, res) => {
    logger.info('Attempting to retrieve user profile');
    const { token } = req.cookies;

    if (token) {
        jwt.verify(
            token,
            'idsfu&ASUDIhiedUioGYUYFHIUGTygbhbhY3427HS',
            {},
            (err, user) => {
                if (err) {
                    logger.warn('Invalid token provided for profile retrieval');
                    return res.json({ error: 'Invalid token' });
                }
                logger.info(
                    `Profile retrieved successfully for user: ${user.username}`
                );
                res.json(user);
            }
        );
    } else {
        logger.warn('No token found for profile retrieval');
        res.json('No token found');
    }
};

const addGoal = async (req, res) => {
    const { userId, goal } = req.body;
    try {
        logger.info('Hinzufügen eines neuen Ziels für Benutzer:', userId);
        const user = await User.findById(userId);
        if (!user) {
            logger.warn('Benutzer nicht gefunden:', userId);
            return res.status(404).json({ error: 'Benutzer nicht gefunden' });
        }

        const highestId = user.goals.reduce(
            (maxId, goal) => Math.max(maxId, goal.id),
            0
        );
        const newGoal = {
            ...goal,
            id: highestId + 1,
        };

        user.goals.push(newGoal);
        await user.save();
        logger.info('Ziel hinzugefügt:', newGoal);
        res.status(200).json(user.goals);
    } catch (error) {
        logger.error('Fehler beim Hinzufügen des Ziel:', error);
        res.status(500).json({ error: 'Fehler beim Hinzufügen des Ziel' });
    }
};

const getGoals = async (req, res) => {
    const { userId } = req.query;
    try {
        logger.info('Abrufen der Ziele für Benutzer:', userId);
        const user = await User.findById(userId);
        if (!user) {
            logger.warn('Benutzer nicht gefunden:', userId);
            return res.status(404).json({ error: 'Benutzer nicht gefunden' });
        }
        logger.info('Ziele gefunden:', user.goals);
        res.status(200).json(user.goals);
    } catch (error) {
        logger.error('Fehler beim Abrufen der Ziele:', error);
        res.status(500).json({ error: 'Fehler beim Abrufen der Ziele' });
    }
};

const deleteGoal = async (req, res) => {
    const { userId } = req.body;
    const { id } = req.params;
    try {
        logger.info('Löschen des Ziels mit ID:', id, 'für Benutzer:', userId);
        const user = await User.findById(userId);
        if (!user) {
            logger.warn('Benutzer nicht gefunden:', userId);
            return res.status(404).json({ error: 'Benutzer nicht gefunden' });
        }
        user.goals = user.goals.filter((goal) => goal.id !== parseInt(id));
        await user.save();
        logger.info('Ziel gelöscht:', id);
        res.status(200).json(user.goals);
    } catch (error) {
        logger.error('Fehler beim Löschen des Ziels:', error);
        res.status(500).json({ error: 'Fehler beim Löschen des Ziels' });
    }
};

const updateGoal = async (req, res) => {
    const { userId, goal } = req.body;
    const { id } = req.params;
    try {
        logger.info(`Aktualisiere Ziel mit ID ${id} für Benutzer ${userId}`);
        const user = await User.findById(userId);
        if (!user) {
            logger.warn(`Benutzer mit ID ${userId} nicht gefunden`);
            return res.status(404).json({ error: 'Benutzer nicht gefunden' });
        }
        const goalIndex = user.goals.findIndex((g) => g.id === parseInt(id));
        if (goalIndex === -1) {
            logger.warn(`Ziel mit ID ${id} nicht gefunden`);
            return res.status(404).json({ error: 'Ziel nicht gefunden' });
        }
        user.goals[goalIndex] = goal;
        await user.save();
        logger.info(`Ziel mit ID ${id} erfolgreich aktualisiert`);
        res.status(200).json(user.goals);
    } catch (error) {
        logger.error('Fehler beim Aktualisieren des Ziel:', error);
        res.status(500).json({ error: 'Fehler beim Aktualisieren des Ziels' });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getProfile,
    addGoal,
    getGoals,
    deleteGoal,
    updateGoal,
};
