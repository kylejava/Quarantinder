const path = require('path');

module.exports = {
  entry: {
    index: './src/index2.js',
    record: './src/recordTest.js',
    chat: './src/chat.js'
  },
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: '[name].js'
  }
};
