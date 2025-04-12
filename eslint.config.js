module.exports = {

  languageOptions: {
    parserOptions: {
      project: 'tsconfig.json',
      tsconfigRootDir: __dirname,
      sourceType: 'module',
    },
    globals: {
      node: true,
      est: true,
    }
  },
  plugins: {
    '@typescript-eslint/eslint-plugin': {},
    '@typescript-eslint/parser': {},
    '@typescript-eslint/recommended': {},
    'plugin:prettier/recommended': {}
  },
  ignores: ['eslint.config.js'],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
  },
};
