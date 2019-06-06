const webpackConfig = require("./webpack.config");

module.exports = function(config) {
  config.set({
    frameworks: ["browserify", "detectBrowsers", "mocha"],
    files: [
      "test/local.sign.spec.js"
    ],
    preprocessors: {
      // don't use browserify, because it don't support dynamic require.
      // and some file is dynamic required in the `stm-lib` package.
      "test/*.js": ["webpack"]
    },
    singleRun: true,
    plugins: [
      "karma-webpack",
      "karma-browserify",
      "karma-chrome-launcher",
      "karma-env-preprocessor",
      "karma-firefox-launcher",
      "karma-detect-browsers",
      "karma-mocha"
    ],
    webpack: {
      node: webpackConfig.node,
      resolve: webpackConfig.resolve,
      mode: "development"
    },
    envPreprocessor: [
      "RANDOM_TESTS_REPEAT"
    ],
    detectBrowsers: {
      enabled: true,
      usePhantomJS: false,
      postDetection(availableBrowser) {
        if (availableBrowser.includes("Chrome")) {
          return ["ChromeHeadless"];
        }

        var browsers = ["Chrome", "Firefox"];
        return browsers.filter(function(browser) {
          return availableBrowser.indexOf(browser) !== -1;
        });
      }
    }
  });
};