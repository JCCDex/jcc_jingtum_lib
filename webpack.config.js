const DuplicatePackageCheckerPlugin = require("duplicate-package-checker-webpack-plugin");
const path = require("path");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const pkg = require("./package.json");

const config = {
  entry: "./src/local_sign.js",
  output: {
    filename: "jcc-local-sign." + pkg.version + ".js",
    path: path.resolve(__dirname, "./dist"),
    libraryTarget: "umd"
  },
  target: "web",
  resolve: {
    extensions: [".js"]
  },
  mode: process.env.MODE === "dev" ? 'development' : "production",
  node: {
    fs: "empty",
    tls: "empty",
    "child_process": "empty",
    net: "empty"
  },
  plugins: [
    new DuplicatePackageCheckerPlugin(),
    new UglifyJsPlugin({
      uglifyOptions: {
        compress: {
          sequences: true,
          dead_code: true,
          drop_console: true,
          drop_debugger: true,
          unused: true
        }
      },
      sourceMap: false,
      parallel: true
    })
  ]
};

if (process.env.REPORT === "true") {
  config.plugins.push(new BundleAnalyzerPlugin())
}

module.exports = config;