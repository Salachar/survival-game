const path = require('path');

module.exports = {
    entry: './src/js/main.js',
    output: {
        filename: 'base.js',
        path: path.resolve(__dirname)
    },
    optimization: {
        minimize: false
    },
    watch: true
};