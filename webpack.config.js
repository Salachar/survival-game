const path = require('path');

module.exports = {
    entry: './src/js/main.js',
    module: {
        rules: [{
            test: /\.(png|jpe?g|gif)$/i,
            loader: 'file-loader',
            options: {
                name: '[path][name].[ext]',
                esModule: false,
            },
        }],
    },
    output: {
        filename: 'base.js',
        path: path.resolve(__dirname, 'build')
    },
    optimization: {
        minimize: false
    },
    resolve: {
        alias: {
            core: path.resolve(__dirname, 'src/js/core/'),
            game: path.resolve(__dirname, 'src/js/game/'),
            lib: path.resolve(__dirname, 'src/js/lib/')
        }
    },
    watch: true,
};