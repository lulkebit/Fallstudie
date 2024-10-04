const express = require('express');
const router = express.Router();
const cors = require('cors');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });
const {
    registerUser,
    loginUser,
    getProfile,
    addGoal,
    getGoals,
    deleteGoal,
    updateGoal,
    updateProfile,
} = require('../controllers/authController');

// Konfiguriere CORS für diesen Router
// - credentials: true ermöglicht das Senden von Cookies in Cross-Origin-Anfragen
// - origin: ['http://localhost:3000'] erlaubt nur Anfragen von dieser spezifischen Domain (in diesem Fall, einem Frontend, das auf localhost:3000 läuft)
router.use(
    cors({
        credentials: true,
        origin: ['http://localhost:3000'],
    })
);

// Definiere eine POST-Route für die Benutzerregistrierung, die die Funktion registerUser aufruft
router.post('/register', registerUser);

// Definiere eine POST-Route für die Benutzeranmeldung, die die Funktion loginUser aufruft
router.post('/login', loginUser);

// Definiert eine GET-Route für '/profile', die die Funktion getProfile aufruft, um das Profil des angemeldeten Benutzers abzurufen.
router.get('/profile', getProfile);

router.post('/goals', addGoal);
router.get('/goals', getGoals);
router.delete('/goals/:id', deleteGoal);
router.put('/goals/:id', updateGoal);
router.put('/profile', upload.single('avatar'), updateProfile);

// Exportiere den Router, damit er in der Hauptanwendung verwendet werden kann
module.exports = router;
