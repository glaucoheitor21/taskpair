/* Mocks globais dos testes. */
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

// Ícones carregam fonte via expo-asset, que não existe no ambiente de teste.
jest.mock('@expo/vector-icons/Feather', () => {
  const React = require('react');
  const { Text } = require('react-native');
  const Icon = ({ name }) => React.createElement(Text, null, name);
  Icon.glyphMap = {};
  return { __esModule: true, default: Icon };
});
