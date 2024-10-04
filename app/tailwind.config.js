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
            keyframes: {
                'slide-in-right': {
                    '0%': { transform: 'translateX(100%)', opacity: 0 },
                    '100%': { transform: 'translateX(0)', opacity: 1 },
                },
                'slide-out-right': {
                    '0%': { transform: 'translateX(0)', opacity: 1 },
                    '100%': { transform: 'translateX(100%)', opacity: 0 },
                },
                'fade-in': {
                    '0%': { opacity: 0 },
                    '100%': { opacity: 1 },
                },
                'fade-out': {
                    '0%': { opacity: 1 },
                    '100%': { opacity: 0 },
                },
            },
            animation: {
                'slide-in-right': 'slide-in-right 0.5s ease-out',
                'slide-out-right': 'slide-out-right 0.5s ease-out',
                'fade-in': 'fade-in 0.5s ease-out',
                'fade-out': 'fade-out 0.5s ease-out',
            },
        },
    },
    plugins: [],
};
