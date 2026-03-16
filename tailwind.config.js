import plugin from 'tailwindcss/plugin'

export default {
  theme: {
    extend: {
      fontFamily: {
        sans: ['Lora', 'sans-serif'],
        custom: ['eternals-universe'],
      },
      textShadow: {
        'sm': '0 0px 2px black',
        DEFAULT: '0px 0px 4px black',
        'md': '0px 0px 8px` black',
        'lg': '0px 0px 30px black',
        'none': 'none'
      },
      colors: {
        'accent': {
          DEFAULT: 'var(--color-accent)',
          '600': 'hsl(from var(--color-accent) h s calc(l - 10))',
        }
      },
      animation: {
        ['smooth-slide']: 'smooth-slide 20s ease-in-out infinite alternate',
      },
      keyframes: {
        ['smooth-slide']: {
          'from': { ['object-position']: '0% 0%' },
          'to': { ['object-position']: '100% 0%' },
        }
      },
    },
  },
  plugins: [
    plugin(function ({ matchUtilities, theme }) {
      matchUtilities(
        {
          'text-shadow': (value) => ({
            textShadow: value,
          }),
        },
        { values: theme('textShadow') }
      )
    }),
    require("tailwindcss-animate"),
    plugin(function ({ addComponents }) {
      addComponents({
        '.object-t30': {
          'object-position': 'center 30%',
        },
      });
    }),
  ],
}