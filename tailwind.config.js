/** @type {import('tailwindcss').Config} */
module.exports = {
    important: false,
    content: [
        './components/**/*.{js,vue,ts}',
        './layouts/**/*.vue',
        './pages/**/*.vue',
        './plugins/**/*.{js,ts}',
        './nuxt.config.{js,ts}',
        './app.vue',
    ],
    corePlugins: {
        preflight: true,
    },
    theme: {
        container: {
            center: true,
        },
        extend: {
            boxShadow: {
                '3xl': '0 35px 60px -15px rgba(0, 0, 0, 0.3)',
            },
        },
    },
    plugins: [require('@tailwindcss/typography')],

}
