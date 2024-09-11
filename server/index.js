// Importiert express, eine Bibliothek zum Erstellen von Webservern und APIs
const express = require('express');

// Erstellt eine Express-Anwendung
const app = express();

// Middleware zum Parsen von JSON-Daten im Anfragekörper
app.use(express.json());

// Verwendet die Authentifizierungsrouten aus der Datei './routes/authRoutes'
// Alle Anfragen, die an die Wurzel ('/') gesendet werden, werden an den Router weitergeleitet
app.use('/', require('./routes/authRoutes'));

// Definiert den Port, auf dem der Server läuft
const port = 8000;

// Startet den Server und gibt eine Nachricht in der Konsole aus, dass der Server läuft
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
