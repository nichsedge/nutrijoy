import nextConfig from 'eslint-config-next';

const config = [
  {
    ignores: ['.next/**', 'node_modules/**'],
  },
  ...nextConfig,
  {
    rules: {
      'react/no-unescaped-entities': 'off',
      'react-hooks/purity': 'off',
      'react-hooks/set-state-in-effect': 'off',
      'react-hooks/rules-of-hooks': 'off',
    },
  },
];

export default config;
