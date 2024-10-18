const fs = require('fs');
const os = require('os');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

/**
 * Farbcodes für verschiedene Log-Levels in der Konsolenausgabe
 */
const colors = {
    DEBUG: '\x1b[36m', // Cyan
    INFO: '\x1b[32m', // Grün
    WARN: '\x1b[33m', // Gelb
    ERROR: '\x1b[31m', // Rot
    RESET: '\x1b[0m', // Zurücksetzen der Farbe
};

// Erstellen des Log-Verzeichnisses, falls es nicht existiert
const logDirectory = path.join(__dirname, 'logs');
if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory);
}

// Maximale Größe einer Log-Datei vor der Rotation (10 MB)
const MAX_LOG_SIZE = 10 * 1024 * 1024;

/**
 * Generiert den Dateinamen für die aktuelle Log-Datei basierend auf dem aktuellen Datum
 * @returns {string} Pfad zur Log-Datei
 */
const getLogFileName = () => {
    const now = new Date();
    return path.join(logDirectory, `${now.toISOString().split('T')[0]}.log`);
};

/**
 * Rotiert die Log-Datei, wenn sie die maximale Größe erreicht hat
 * @param {string} logFileName - Pfad zur zu prüfenden Log-Datei
 */
const rotateLogFile = (logFileName) => {
    const stats = fs.statSync(logFileName);
    if (stats.size >= MAX_LOG_SIZE) {
        const newFileName = `${logFileName}.${Date.now()}`;
        fs.renameSync(logFileName, newFileName);
    }
};

/**
 * Schreibt eine Nachricht in die Log-Datei
 * @param {string} message - Die zu logende Nachricht
 */
const logToFile = (message) => {
    const logFileName = getLogFileName();

    if (fs.existsSync(logFileName)) {
        rotateLogFile(logFileName);
    }

    fs.appendFileSync(logFileName, message + '\n', 'utf8');
};

/**
 * Generiert eine Log-Nachricht und schreibt sie in die Konsole und Datei
 * @param {string} type - Log-Level (DEBUG, INFO, WARN, ERROR)
 * @param {string} message - Hauptnachricht
 * @param {...any} args - Zusätzliche Argumente
 */
const log = (type, message, ...args) => {
    const now = new Date();
    const timestamp = `${now.toLocaleString('de-DE', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
    })}.${now.getMilliseconds().toString().padStart(3, '0')}`;
    const color = colors[type] || colors.RESET;
    const logMessage = `[${timestamp}] [${type}] ${message} ${args.join(' ')}`;
    console.log(
        `[${timestamp}] [${color}${type}${colors.RESET}] ${message}`,
        ...args
    );
    logToFile(logMessage);
};

/**
 * Loggt eine Debug-Nachricht
 * @param {string} message - Die zu logende Nachricht
 * @param {...any} args - Zusätzliche Argumente
 */
const debug = (message, ...args) => log('DEBUG', message, ...args);

/**
 * Loggt eine Info-Nachricht
 * @param {string} message - Die zu logende Nachricht
 * @param {...any} args - Zusätzliche Argumente
 */
const info = (message, ...args) => log('INFO', message, ...args);

/**
 * Loggt eine Warn-Nachricht
 * @param {string} message - Die zu logende Nachricht
 * @param {...any} args - Zusätzliche Argumente
 */
const warn = (message, ...args) => log('WARN', message, ...args);

/**
 * Loggt eine Error-Nachricht mit einer eindeutigen Error-ID
 * @param {string} message - Die Fehlermeldung
 * @param {Error} err - Das Error-Objekt
 * @param {...any} args - Zusätzliche Argumente
 * @returns {string} Die generierte Error-ID
 */
const error = (message, err, ...args) => {
    const errorId = uuidv4();
    const errorMessage = `Error ID: ${errorId} - ${message}`;
    log('ERROR', errorMessage, ...args);
    if (err && err.stack) {
        logToFile(err.stack);
    }
    return errorId;
};

/**
 * Loggt wichtige Serverdaten wie Speichernutzung, Auslastung und Uptime
 */
const logServerVitals = () => {
    const memoryUsage = process.memoryUsage();
    const loadAverage = os.loadavg();
    const uptime = process.uptime();

    const formattedMemoryUsage = `
        RSS: ${(memoryUsage.rss / 1024 / 1024).toFixed(2)} MB
        Heap Total: ${(memoryUsage.heapTotal / 1024 / 1024).toFixed(2)} MB
        Heap Used: ${(memoryUsage.heapUsed / 1024 / 1024).toFixed(2)} MB
        External: ${(memoryUsage.external / 1024 / 1024).toFixed(2)} MB
    `;

    const formattedLoadAverage = `
        1-min: ${loadAverage[0].toFixed(2)}
        5-min: ${loadAverage[1].toFixed(2)}
        15-min: ${loadAverage[2].toFixed(2)}
    `;

    const formattedUptime = `${(uptime / 60).toFixed(2)} minutes`;

    const vitalsMessage = `
        Server Vitals:
        Memory Usage: ${formattedMemoryUsage}
        Load Average: ${formattedLoadAverage}
        Uptime: ${formattedUptime}
    `;

    debug(vitalsMessage.trim());
};

// Log server vitals every 5 minutes (300000 milliseconds)
setInterval(logServerVitals, 300000);

module.exports = {
    info,
    warn,
    error,
    debug,
};
