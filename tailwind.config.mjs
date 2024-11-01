/** @type {import('tailwindcss').Config} */

const defaultTheme = require('tailwindcss/defaultTheme')

export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
      fontFamily: {
        serif: [
          'Libertinus Serif',
          ...defaultTheme.fontFamily.serif,
        ],
        display: 'Libertinus Serif Display, ui-serif',
        initials: 'Libertinus Serif Initials, ui-serif',
      }
    },
	},
	plugins: [
    require('daisyui'),
    require('@tailwindcss/typography'),
  ],
  daisyui: {
    themes: [
      "sunset",
    ]
  }
}
