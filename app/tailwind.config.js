/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class',
    content: [
        './src/**/*.{js,jsx}', // Dies stellt sicher, dass Tailwind alle React-Komponenten scannt
    ],
    purge: {
        enabled: true,
        content: ['./src/**/*.jsx'],
        options: {
            keyframes: true,
        },
    },
};
