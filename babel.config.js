module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./src'],
          alias: {
            '@': './src',
            '@theme': './src/theme',
            '@components': './src/components',
            '@screens': './src/screens',
            '@services': './src/services',
          },
        },
      ],
    ],
  };
};
