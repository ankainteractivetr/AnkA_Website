/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
    theme: {
        extend: {
            colors: {
                ink: {
                    900: '#06050a',
                    800: '#0c0a10',
                    700: '#13111a',
                    600: '#1a1722',
                    500: '#24202c',
                    400: '#332e3d',
                },
                ember: {
                    DEFAULT: '#C02D00',
                    50: '#fff1eb',
                    100: '#ffd8c4',
                    200: '#ffae87',
                    300: '#ff7a3d',
                    400: '#ee4d11',
                    500: '#C02D00',
                    600: '#9a2300',
                    700: '#751a00',
                    800: '#511100',
                },
                phoenix: {
                    DEFAULT: '#F5A524',
                    light: '#FFD66B',
                    dark: '#B8761A',
                },
                parchment: '#F5F1E8',
                ash: '#8B7E70',
            },
            fontFamily: {
                display: ['"Cinzel"', 'serif'],
                deco:    ['"Cinzel Decorative"', 'serif'],
                heading: ['"Bebas Neue"', 'sans-serif'],
                sans:    ['"Outfit"', 'system-ui', 'sans-serif'],
                accent:  ['"Shadows Into Light"', 'cursive'],
            },
            backgroundImage: {
                'noise': "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.4 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
                'ember-glow': 'radial-gradient(circle at 30% 20%, rgba(192,45,0,0.18), transparent 50%), radial-gradient(circle at 80% 80%, rgba(245,165,36,0.10), transparent 50%)',
            },
            boxShadow: {
                'ember':     '0 0 40px -8px rgba(192, 45, 0, 0.55)',
                'ember-sm':  '0 0 14px -2px rgba(192, 45, 0, 0.4)',
                'phoenix':   '0 0 30px -6px rgba(245, 165, 36, 0.45)',
                'inner-ink': 'inset 0 1px 0 rgba(255,255,255,0.04), inset 0 -1px 0 rgba(0,0,0,0.5)',
            },
            keyframes: {
                'fade-up': {
                    '0%':   { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                'glow-pulse': {
                    '0%, 100%': { boxShadow: '0 0 30px -6px rgba(192,45,0,0.4)' },
                    '50%':      { boxShadow: '0 0 60px -4px rgba(192,45,0,0.65)' },
                },
                'shimmer': {
                    '0%':   { backgroundPosition: '-200% 0' },
                    '100%': { backgroundPosition: '200% 0' },
                },
            },
            animation: {
                'fade-up':    'fade-up 0.7s ease-out forwards',
                'glow-pulse': 'glow-pulse 3.5s ease-in-out infinite',
                'shimmer':    'shimmer 2.4s linear infinite',
            },
        },
    },
    plugins: [],
};
