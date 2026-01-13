import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                // Kita definisikan warna custom di sini
                dark: "#0a0a0a", // Hitam pekat (Background utama)

                // Gunakan warna Cyan/Biru Muda sebagai Primary
                primary: {
                    DEFAULT: "#06b6d4", // Cyan-500
                    foreground: "#ffffff",
                },

                // Gunakan warna Ungu/Violet sebagai Secondary
                secondary: {
                    DEFAULT: "#8b5cf6", // Violet-500
                    foreground: "#ffffff",
                },

                // Warna kartu/elemen (sedikit lebih terang dari dark)
                card: "#171717",
            },
            fontFamily: {
                sans: ["var(--font-inter)"],
                mono: ["var(--font-fira)"],
            },
        },
    },
    plugins: [],
};

export default config;