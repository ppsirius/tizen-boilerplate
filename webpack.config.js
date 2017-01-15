'use strict';

var BASE_PATH = __dirname,
    SOURCE_PATH = BASE_PATH + '/src';

module.exports = {
    entry: [
        SOURCE_PATH + "/js/main.js"
    ],
    output: {
        path: BASE_PATH + "/dist/js",
        filename: "bundle.js"
    },
    debug: true,
    devtool: 'source-map',
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: [/node_modules/],
                loader: 'babel-loader',
                query: {
                    presets: ['es2015']
                }
            }
        ]
    },
    devServer: {
        port: 3000,
        host: '106.120.67.23',
        contentBase: BASE_PATH + "/dist",
        watchOptions: {
            aggregateTimeout: 300
        },
        stats: 'errors-only'
    }
};

