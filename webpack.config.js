const path = require("path");

let basePath = path.resolve(__dirname),
  sourcePath = path.resolve(__dirname, "./src"),
  distPath = path.resolve(__dirname, "./dist");

console.log(distPath);

module.exports = {
  entry: {
    main: path.resolve(sourcePath, "./js/main.js")
  },
  output: {
    path: path.resolve(distPath, "./js"),
    filename: "[name].bundle.js"
  },
  devtool: "source-map",
  devServer: {
    contentBase: distPath
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        options: {
          presets: [["es2015", { modules: false }]]
        }
      }
    ]
  }
};
