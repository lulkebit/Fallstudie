const express = require('express');

const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

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

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

app.use('/', require('./routes/routes'));

const port = 8000;

app.listen(port, () => {
    logger.info(texts.SERVER.RUNNING(port));
});
