const es2015 = require('babel-preset-es2015').buildPreset;

const ENV = process.env.BABEL_ENV;

module.exports = {
  presets: [
    [ es2015, {
      loose: true,
      modules: false,
      // `modules: 'umd'` => This disables tree-shaking
      // MUI Code -> modules: ENV === 'es' ? false : 'commonjs'
    }],
  ],
};
