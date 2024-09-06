const express = require('express');
const router = express.Router();
const cors = require('cors');
const { registerUser, loginUser } = require('../controllers/authController');

// middleware
router.use(
    cors({
        credentials: true,
        origin: ['http://localhost:3000'],
    })
);

router.post('/register', registerUser);
router.post('/login', loginUser);

module.exports = router;
