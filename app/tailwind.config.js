/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class',
    content: ['./src/**/*.{js,jsx}'],
    purge: {
        enabled: true,
        content: ['./src/**/*.jsx', './src/**/*.js', './public/index.html'],
        options: {
            keyframes: true,
            fontFace: true,
            safelist: [/^bg-/, /^text-/, /^border-/, /^hover:/, /^dark:/],
        },
    },
    future: {
        hoverOnlyWhenSupported: true,
    },
    theme: {
        extend: {
            screens: {
                '3xl': '1920px',
            },
        },
    },
};
