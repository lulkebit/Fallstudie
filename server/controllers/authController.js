const jwt = require('jsonwebtoken');
const User = require('../models/user');
const logger = require('../utils/logger');
const { hashPassword, comparePassword } = require('../helpers/auth');
const avatars = require('../ressources/avatars');

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

        const randomAvatar =
            avatars[Math.floor(Math.random() * avatars.length)];

        const user = await User.create({
            username,
            email,
            password: hashedPassword,
            firstname,
            lastname,
            avatar: randomAvatar,
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

const logoutUser = (req, res) => {
    try {
        logger.info('Attempting user logout');
        res.clearCookie('token');
        res.json({ message: 'Erfolgreich abgemeldet' });
        logger.info('User logged out');
    } catch (error) {
        logger.error('Error on user logout:', error);
        return res.json({
            error: error.message,
        });
    }
};

const getProfile = async (req, res) => {
    logger.info('Attempting to retrieve user profile');
    const { token } = req.cookies;

    if (token) {
        jwt.verify(
            token,
            'idsfu&ASUDIhiedUioGYUYFHIUGTygbhbhY3427HS',
            {},
            async (err, decoded) => {
                if (err) {
                    logger.warn('Invalid token provided for profile retrieval');
                    return res.json({ error: 'Invalid token' });
                }

                try {
                    const user = await User.findById(decoded.id).select(
                        '-password -goals'
                    );
                    if (!user) {
                        logger.warn('User not found for profile retrieval');
                        return res
                            .status(404)
                            .json({ error: 'User not found' });
                    }

                    logger.info(
                        `Profile retrieved successfully for user: ${user.username}`
                    );
                    res.json(user);
                } catch (error) {
                    logger.error('Error retrieving user profile:', error);
                    res.status(500).json({
                        error: 'Error retrieving user profile',
                    });
                }
            }
        );
    } else {
        logger.warn('No token found for profile retrieval');
        res.json('No token found');
    }
};

const updateProfile = async (req, res) => {
    try {
        const { userId, username, email, firstname, lastname } = req.body;
        const avatar = req.file
            ? req.file.buffer.toString('base64')
            : undefined;

        logger.info(`Attempting to update profile for user ID: ${userId}`);

        const user = await User.findById(userId);
        if (!user) {
            logger.warn(
                `Profile update failed: User not found with ID ${userId}`
            );
            return res.status(404).json({ error: 'Benutzer nicht gefunden' });
        }

        if (user.username !== username) {
            logger.info(
                `User ID: ${userId} - Username changed from '${user.username}' to '${username}'`
            );
        }
        if (user.email !== email) {
            logger.info(
                `User ID: ${userId} - Email changed from '${user.email}' to '${email}'`
            );
        }
        if (user.firstname !== firstname) {
            logger.info(
                `User ID: ${userId} - Firstname changed from '${user.firstname}' to '${firstname}'`
            );
        }
        if (user.lastname !== lastname) {
            logger.info(
                `User ID: ${userId} - Lastname changed from '${user.lastname}' to '${lastname}'`
            );
        }
        if (avatar !== undefined) {
            logger.info(
                `User ID: ${userId} - Avatar changed from '...${user.avatar.slice(
                    -10
                )}' to '...${avatar.slice(-10)}'`
            );
        }

        user.username = username;
        user.email = email;
        user.firstname = firstname;
        user.lastname = lastname;

        if (avatar !== undefined && avatar !== null) {
            user.avatar = avatar;
        }

        await user.save();

        res.cookie('user', JSON.stringify(user), { httpOnly: true });

        res.json(user);
    } catch (error) {
        logger.error('Fehler beim Aktualisieren des Profils:', error);
        res.status(500).json({
            error: 'Fehler beim Aktualisieren des Profils',
        });
    }
};

const changePassword = async (req, res) => {
    const { userId, oldPassword, newPassword } = req.body;

    try {
        logger.info(`User ${userId} is attempting to change password`);
        const user = await User.findById(userId);
        if (!user) {
            logger.warn(`User ${userId} not found`);
            return res.status(404).json({ error: 'Benutzer nicht gefunden' });
        }

        const isMatch = await comparePassword(oldPassword, user.password);
        if (!isMatch) {
            logger.warn('Old password is incorrect');
            return res.status(400).json({ error: 'Altes Passwort ist falsch' });
        }

        user.password = await hashPassword(newPassword);
        await user.save();

        logger.info('Password successfully changed');
        res.status(200).json({ message: 'Passwort erfolgreich geändert' });
    } catch (error) {
        logger.error('Fehler beim Ändern des Passworts:', error);
        res.status(500).json({ error: 'Fehler beim Ändern des Passworts' });
    }
};

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    getProfile,
    updateProfile,
    changePassword,
};
