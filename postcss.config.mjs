/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    // Perhatikan: Kita sekarang menggunakan '@tailwindcss/postcss' dengan tanda kutip
    '@tailwindcss/postcss': {},
    autoprefixer: {},
  },
};

export default config;