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
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                options: {
                    presets: [
                        [ 'es2015', { modules: false } ]
                    ]
                }
            }
        ]
    }
};


