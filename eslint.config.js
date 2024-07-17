// @ts-check
import antfu from '@antfu/eslint-config'

export default antfu(
  {
    ignores: [
      // eslint ignore globs here
    ],

  },
  {
    rules: {
      // overrides
      'no-console': 0,
      'node/prefer-global/process': 0,
    },
  },
)
