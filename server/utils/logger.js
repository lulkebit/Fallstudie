const log = (type, message, ...args) => {
    const timestamp = new Date().toLocaleString('de-DE', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
    });
    console.log(`[${timestamp}] [${type}] ${message}`, ...args);
};

const info = (message, ...args) => log('INFO', message, ...args);
const warn = (message, ...args) => log('WARN', message, ...args);
const error = (message, ...args) => log('ERROR', message, ...args);

module.exports = {
    info,
    warn,
    error,
};
