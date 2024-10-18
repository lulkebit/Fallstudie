const bcrypt = require('bcrypt');

/**
 * Verschlüsselt ein Passwort mit bcrypt.
 *
 * @param {string} password - Das zu verschlüsselnde Passwort im Klartext.
 * @returns {Promise<string>} Ein Promise, das bei erfolgreicher Verschlüsselung den Hash des Passworts zurückgibt.
 * @throws {Error} Wenn ein Fehler während der Salz-Generierung oder Hashing auftritt.
 */
const hashPassword = (password) => {
    return new Promise((resolve, reject) => {
        bcrypt.genSalt(12, (err, salt) => {
            if (err) {
                reject(err);
            }

            bcrypt.hash(password, salt, (err, hash) => {
                if (err) {
                    reject(err);
                }
                resolve(hash);
            });
        });
    });
};

/**
 * Vergleicht ein Klartext-Passwort mit einem gehashten Passwort.
 *
 * @param {string} password - Das zu überprüfende Klartext-Passwort.
 * @param {string} hash - Der gespeicherte Passwort-Hash.
 * @returns {Promise<boolean>} Ein Promise, das true zurückgibt, wenn das Passwort übereinstimmt, sonst false.
 */
const comparePassword = (password, hash) => {
    return bcrypt.compare(password, hash);
};

module.exports = {
    hashPassword,
    comparePassword,
};
