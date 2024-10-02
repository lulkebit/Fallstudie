/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './src/**/*.{js,jsx,ts,tsx}', // Dies stellt sicher, dass Tailwind alle React-Komponenten scannt
    ],
    theme: {
        extend: {
            colors: {
                primary: '#069ECF',
                secondary: '#FE0000',
            },
        },
    },
    plugins: [],
};