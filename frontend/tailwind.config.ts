import type { Config } from 'tailwindcss';

const config: Config = {
    content: [
        './pages/**/*.{ts,tsx}',
        './app/**/*.{ts,tsx}',
        './components/**/*.{ts,tsx}'
    ],
    theme: {
        extend: {
            colors: {
                background: {
                    DEFAULT: `hsl(var(--background))`,
                    light: `hsl(var(--background-light))`,
                    dark: `hsl(var(--background-dark))`,
                }
            }
        },
    },
    plugins: [],
};
export default config;