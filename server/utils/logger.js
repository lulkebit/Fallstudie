const fs = require('fs');
const os = require('os');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const colors = {
    DEBUG: '\x1b[36m',
    INFO: '\x1b[32m',
    WARN: '\x1b[33m',
    ERROR: '\x1b[31m',
    RESET: '\x1b[0m',
};

const logDirectory = path.join(__dirname, 'logs');
if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory);
}

const getLogFileName = () => {
    const now = new Date();
    return path.join(logDirectory, `${now.toISOString().split('T')[0]}.log`);
};

const logToFile = (message) => {
    const logFileName = getLogFileName();
    fs.appendFileSync(logFileName, message + '\n', 'utf8');
};

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

const debug = (message, ...args) => log('DEBUG', message, ...args);
const info = (message, ...args) => log('INFO', message, ...args);
const warn = (message, ...args) => log('WARN', message, ...args);
const error = (message, err, ...args) => {
    const errorId = uuidv4();
    const errorMessage = `Error ID: ${errorId} - ${message}`;
    log('ERROR', errorMessage, ...args);
    if (err && err.stack) {
        logToFile(err.stack);
    }
    return errorId;
};

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
