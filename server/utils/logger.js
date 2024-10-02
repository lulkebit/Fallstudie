const colors = {
    INFO: '\x1b[32m', // Grün
    WARN: '\x1b[33m', // Gelb
    ERROR: '\x1b[31m', // Rot
    RESET: '\x1b[0m', // Zurücksetzen
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
    console.log(
        `[${timestamp}] [${color}${type}${colors.RESET}] ${message}`,
        ...args
    );
};

const info = (message, ...args) => log('INFO', message, ...args);
const warn = (message, ...args) => log('WARN', message, ...args);
const error = (message, ...args) => log('ERROR', message, ...args);

module.exports = {
    info,
    warn,
    error,
};
