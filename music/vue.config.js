const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  transpileDependencies: true,
  pwa: {
    name: 'Drew Music',
    themeColor: '#0bce5a',
    manifestOptions: {
      short_name: 'Music',
    }
  }
});
