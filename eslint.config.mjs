import nextPlugin from '@next/eslint-plugin-next'
import antfu from '@antfu/eslint-config'

export default antfu({
  plugins: { '@next/next': nextPlugin },
  rules: {
    ...nextPlugin.configs.recommended.rules,
    ...nextPlugin.configs['core-web-vitals'].rules,
    '@next/next/no-duplicate-head': 'off',
  },
})
