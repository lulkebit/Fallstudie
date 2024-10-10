const jwt = require('jsonwebtoken');
const User = require('../models/user');
const logger = require('../utils/logger');
const { hashPassword, comparePassword } = require('../helpers/auth');
const avatars = require('../ressources/avatars');
const texts = require('../ressources/texts');

const registerUser = async (req, res) => {
    try {
        logger.info(texts.INFO.ATTEMPTING_REGISTER_USER);
        const { firstname, lastname, email, username, password } = req.body;

        const emailExist = await User.findOne({ email });
        if (emailExist) {
            logger.warn(texts.WARNINGS.EMAIL_ALREADY_EXISTS_SERVER(email));
            return res.json({
                error: texts.WARNINGS.EMAIL_ALREADY_EXISTS_CLIENT,
            });
        }

        const usernameExist = await User.findOne({ username });
        if (usernameExist) {
            logger.warn(
                texts.WARNINGS.USERNAME_ALREADY_EXISTS_SERVER(username)
            );
            return res.json({
                error: texts.WARNINGS.USERNAME_ALREADY_EXISTS_CLIENT,
            });
        }

        if (!password || password.length < 6) {
            logger.warn(texts.WARNINGS.PASSWORD_TOO_SHORT);
            return res.json({
                error: texts.WARNINGS.PASSWORD_TOO_SHORT,
            });
        }

        if (!firstname || !lastname) {
            logger.warn(texts.WARNINGS.NAME_MISSING_SERVER);
            return res.json({
                error: texts.WARNINGS.NAME_MISSING_CLIENT,
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

        logger.info(texts.SUCCESS.USER_REGISTERED(username));
        return res.json(user);
    } catch (error) {
        logger.error(texts.ERRORS.ERROR('user registration', error));
        res.status(500).json({ message: error.message });
    }
};

const loginUser = async (req, res) => {
    try {
        logger.info(texts.INFO.ATTEMPTING_LOGIN_USER);
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            logger.warn(texts.WARNINGS.WRONG_EMAIL_SERVER(email));
            return res.json({
                error: texts.WARNINGS.WRONG_CREDENTIALS_CLIENT,
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
                        logger.error(texts.ERRORS.ERROR('token creation', err));
                        return res.status(500).json({
                            error: texts.ERRORS.TOKEN_CREATION_CLIENT,
                        });
                    }

                    logger.info(texts.SUCCESS.USER_LOGGED_IN(user.username));
                    res.cookie('token', token, {
                        httpOnly: true,
                        secure: true,
                    }).json(user);
                }
            );
        } else {
            logger.warn(texts.WARNINGS.WRONG_PASSWORD_SERVER(user.username));
            return res.json({
                error: texts.WARNINGS.WRONG_CREDENTIALS_CLIENT,
            });
        }
    } catch (error) {
        logger.error(texts.ERRORS.ERROR('user login', error));
        res.status(500).json({ message: error.message });
    }
};

const logoutUser = (req, res) => {
    try {
        logger.info(texts.INFO.ATTEMPTING_LOGOUT_USER);
        res.clearCookie('token');
        res.json({ message: texts.MESSAGES.LOGOUT_SUCCESS });
        logger.info(texts.SUCCESS.USER_LOGGED_OUT);
    } catch (error) {
        logger.error(texts.ERRORS.ERROR('user logout', error));
        return res.json({
            error: error.message,
        });
    }
};

const getProfile = async (req, res) => {
    logger.info(texts.INFO.ATTEMPTING_PROFILE_RETRIEVAL);
    const { token } = req.cookies;

    if (token) {
        jwt.verify(
            token,
            'idsfu&ASUDIhiedUioGYUYFHIUGTygbhbhY3427HS',
            {},
            async (err, decoded) => {
                if (err) {
                    logger.warn(texts.WARNINGS.INVALID_TOKEN);
                    return res.json({ error: texts.WARNINGS.INVALID_TOKEN });
                }

                try {
                    const user = await User.findById(decoded.id).select(
                        '-password -goals'
                    );
                    if (!user) {
                        logger.warn(texts.WARNINGS.USER_NOT_FOUND);
                        return res
                            .status(404)
                            .json({ error: texts.WARNINGS.USER_NOT_FOUND });
                    }

                    logger.info(texts.SUCCESS.USER_LOGGED_IN(user.username));
                    res.json(user);
                } catch (error) {
                    logger.error(
                        texts.ERRORS.ERROR('user profile retrieval', error)
                    );
                    res.status(500).json({
                        error: texts.ERRORS.USER_PROFILE_RETRIEVAL,
                    });
                }
            }
        );
    } else {
        logger.warn(texts.WARNINGS.NO_TOKEN_FOUND);
        res.json(texts.WARNINGS.NO_TOKEN_FOUND);
    }
};

const updateProfile = async (req, res) => {
    try {
        const { userId, username, email, firstname, lastname } = req.body;
        const avatar = req.file
            ? req.file.buffer.toString('base64')
            : undefined;

        logger.info(texts.INFO.ATTEMPTING_PROFILE_UPDATE(userId));

        const user = await User.findById(userId);
        if (!user) {
            logger.warn(texts.WARNINGS.USER_NOT_FOUND);
            return res
                .status(404)
                .json({ error: texts.WARNINGS.USER_NOT_FOUND });
        }

        if (user.username !== username) {
            logger.info(
                texts.INFO.PROFILE_FIELD_CHANGED(
                    userId,
                    'Username',
                    user.username,
                    username
                )
            );
        }
        if (user.email !== email) {
            logger.info(
                texts.INFO.PROFILE_FIELD_CHANGED(
                    userId,
                    'Email',
                    user.email,
                    email
                )
            );
        }
        if (user.firstname !== firstname) {
            logger.info(
                texts.INFO.PROFILE_FIELD_CHANGED(
                    userId,
                    'Firstname',
                    user.firstname,
                    firstname
                )
            );
        }
        if (user.lastname !== lastname) {
            logger.info(
                texts.INFO.PROFILE_FIELD_CHANGED(
                    userId,
                    'Lastname',
                    user.lastname,
                    lastname
                )
            );
        }
        if (avatar !== undefined) {
            logger.info(
                texts.INFO.PROFILE_FIELD_CHANGED(
                    userId,
                    'Avatar',
                    `...${user.avatar.slice(-10)}`,
                    `...${avatar.slice(-10)}`
                )
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
        logger.error(texts.ERRORS.ERROR('profile update', error));
        res.status(500).json({
            error: texts.ERRORS.PROFILE_UPDATE,
        });
    }
};

const changePassword = async (req, res) => {
    const { userId, oldPassword, newPassword } = req.body;

    try {
        logger.info(texts.INFO.ATTEMPTING_PASSWORD_CHANGE(userId));
        const user = await User.findById(userId);
        if (!user) {
            logger.warn(texts.WARNINGS.USER_NOT_FOUND);
            return res
                .status(404)
                .json({ error: texts.WARNINGS.USER_NOT_FOUND });
        }

        const isMatch = await comparePassword(oldPassword, user.password);
        if (!isMatch) {
            logger.warn(texts.WARNINGS.OLD_PASSWORD_INCORRECT);
            return res
                .status(400)
                .json({ error: texts.WARNINGS.OLD_PASSWORD_INCORRECT });
        }

        user.password = await hashPassword(newPassword);
        await user.save();

        logger.info(texts.SUCCESS.PASSWORD_CHANGED);
        res.status(200).json({ message: texts.SUCCESS.PASSWORD_CHANGED });
    } catch (error) {
        logger.error(texts.ERRORS.ERROR('password change', error));
        res.status(500).json({ error: texts.ERRORS.PASSWORD_CHANGE });
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
