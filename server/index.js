// Importiert express, eine Bibliothek zum Erstellen von Webservern und APIs
const express = require('express');

const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

// Erstellt eine Express-Anwendung
const app = express();

const logger = require('./utils/logger');
const texts = require('./ressources/texts');

mongoose
    .connect(
        'mongodb+srv://admin:TrackMyGoalAdmin@cluster0.s0t2g.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0' // Sicherheitsrisiko: Verwende eine Umgebungsvariable für die Verbindung
    )
    .then(() => {
        logger.info(texts.SERVER.DATABASE_CONNECTED);
    })
    .catch((err) => {
        logger.error(texts.ERRORS.ERROR('Datenbankverbindung aufbauen'), err);
    });

// Middleware zum Parsen von JSON-Daten im Anfragekörper
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

// Verwendet die Authentifizierungsrouten aus der Datei './routes/authRoutes'
// Alle Anfragen, die an die Wurzel ('/') gesendet werden, werden an den Router weitergeleitet
app.use('/', require('./routes/routes'));

// Definiert den Port, auf dem der Server läuft
const port = 8000;

// Startet den Server und gibt eine Nachricht in der Konsole aus, dass der Server läuft
app.listen(port, () => {
    logger.info(texts.SERVER.RUNNING(port));
});
