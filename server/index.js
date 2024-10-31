const express = require('express');

const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

const app = express();

const logger = require('./utils/logger');
const texts = require('./ressources/texts');

// Verbindung zur MongoDB-Datenbank herstellen
mongoose
    .connect(
        'mongodb+srv://server:nLhE8YEJgGeDjEXQ@cluster0.s0t2g.mongodb.net/myFirstDatabase?retryWrites=true&w=majority&appName=Cluster0' // Sicherheitsrisiko: Verwende eine Umgebungsvariable für die Verbindung
    )
    .then(() => {
        logger.info(texts.SERVER.DATABASE_CONNECTED);
    })
    .catch((err) => {
        console.log(err);
    });

// Middleware-Konfiguration
app.use(express.json({ limit: '50mb' })); // Erhöhtes Limit für JSON-Anfragen
app.use(cookieParser()); // Parsen von Cookies
app.use(express.urlencoded({ extended: false, limit: '50mb' })); // Parsen von URL-encodierten Daten mit erhöhtem Limit

// Routen-Konfiguration
app.use('/', require('./routes/routes'));

// Fehlerbehandlungs-Middleware
app.use((err, req, res, next) => {
    logger.error('Unbehandelter Fehler: ' + err);
    res.status(500).json({ error: 'Interner Serverfehler' });
});

// Server-Port-Konfiguration
const port = 8000;

// Server starten
app.listen(port, () => {
    logger.info(texts.SERVER.RUNNING(port));
});
