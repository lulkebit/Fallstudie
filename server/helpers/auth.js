// Importiere bcrypt, eine Bibliothek zum Hashen von Passwörtern
const bcrypt = require('bcrypt');

/**
 * Funktion zum Hashen eines Passworts.
 * @param {string} password - Das zu hashende Passwort
 * @returns {Promise<string>} - Gibt ein gehashtes Passwort als Promise zurück
 */
const hashPassword = (password) => {
    return new Promise((resolve, reject) => {
        // Erstelle ein Salt mit einem Salzfaktor von 12 (je höher der Wert, desto sicherer, aber auch langsamer)
        bcrypt.genSalt(12, (err, salt) => {
            if (err) {
                reject(err); // Behandle Fehler bei der Salt-Erstellung
            }
            // Hash das Passwort unter Verwendung des generierten Salts
            bcrypt.hash(password, salt, (err, hash) => {
                if (err) {
                    reject(err); // Behandle Fehler beim Hashen
                }
                resolve(hash); // Gib das gehashte Passwort zurück
            });
        });
    });
};

/**
 * Funktion zum Vergleichen eines Passworts mit einem gehashten Wert.
 * @param {string} password - Das eingegebene Passwort
 * @param {string} hash - Das gehashte Passwort zum Vergleich
 * @returns {Promise<boolean>} - Gibt true zurück, wenn das Passwort übereinstimmt, andernfalls false
 */
const comparePassword = (password, hash) => {
    // Vergleiche das eingegebene Passwort mit dem gehashten Passwort
    return bcrypt.compare(password, hash);
};

// Exportiere die Funktionen, damit sie in anderen Modulen verwendet werden können
module.exports = {
    hashPassword,
    comparePassword,
};
