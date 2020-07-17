const merge = require("webpack-merge");
const common = require("./common");
const before = require("../..");

module.exports = (env) =>
  merge(common(env), {
    devServer: {
      before,
    },
  });
