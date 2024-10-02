// Importiere mongoose, eine Bibliothek zur Verwaltung von MongoDB-Datenbanken
const mongoose = require('mongoose');

// Destrukturiere Schema aus mongoose, um ein neues Schema für den Benutzer zu definieren
const { Schema } = mongoose;

// Definiere das Schema für das User-Modell, das die Struktur der Benutzerdaten in der Datenbank beschreibt
const userSchema = new Schema({
    // Definiert das Feld 'username', das vom Typ String ist und in der Datenbank einzigartig sein muss
    username: {
        type: String,
        unique: true, // Stellt sicher, dass der Benutzername eindeutig ist
    },
    // Definiert das Feld 'email', das ebenfalls vom Typ String ist und einzigartig sein muss
    email: {
        type: String,
        unique: true, // Stellt sicher, dass die E-Mail-Adresse eindeutig ist
    },
    // Speichert das gehashte Passwort als String
    password: String,
    // Speichert den Vornamen des Benutzers
    firstname: String,
    // Speichert den Nachnamen des Benutzers
    lastname: String,
    goals: [
        {
            id: Number,
            title: String,
            description: String,
        },
    ],
});

// Erstellt ein Mongoose-Modell namens 'User' basierend auf dem definierten Schema
const UserModel = mongoose.model('User', userSchema);

// Exportiere das User-Modell, damit es in anderen Modulen verwendet werden kann
module.exports = UserModel;
