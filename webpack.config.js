const path = require("path");
const fs = require("fs");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const devMode = process.env.NODE_ENV !== "production";
const webpack = require("webpack");
const copyWebpackPlugin = require("copy-webpack-plugin");

const paths = {
  DIST: path.resolve(__dirname, "dist"),
  SRC: path.resolve(__dirname, "src"),
  JS: path.resolve(__dirname, "src/app"),
};

module.exports = () => {
  let stage = "development";
  let env_file = "./.env";

  if (fs.existsSync(env_file)) {
    require("dotenv").config({ path: env_file });
  }
  return {
    mode: stage,
    entry: path.join(paths.JS, "app.js"),
    output: {
      path: paths.DIST,
      filename: "app.bundle.js",
    },
    plugins: [
      new webpack.DefinePlugin({
        "process.env": {
          REPOSITORY: JSON.stringify(process.env.REPOSITORY),
          ELASTIC_URL: JSON.stringify(process.env.ELASTIC_URL),
          VALIDATOR_URL: JSON.stringify(process.env.VALIDATOR_URL),
          VALIDATOR_REMOTE_URL: JSON.stringify(
            process.env.VALIDATOR_REMOTE_URL
          ),
        },
      }),
      new HtmlWebpackPlugin({
        template: path.join(paths.SRC, "index.html"),
        minify: {
          collapseWhitespace: true,
          minifyCSS: true,
          minifyJS: true,
          removeComments: true,
          useShortDoctype: true,
        },
        favicon: "./src/asset/img/favicon-32x32.png",
      }),
      new MiniCssExtractPlugin({
        filename: devMode ? "[name].css" : "[name].[hash].css",
        chunkFilename: devMode ? "[id].css" : "[id].[hash].css",
      }),
      new copyWebpackPlugin({
        patterns: ["src/wasm/main.wasm", "src/wasm/wasm_exec.js"],
      }),
      new webpack.ProvidePlugin({
        process: "process/browser.js",
        Buffer: ["buffer", "Buffer"],
      }),
    ],
    module: {
      rules: [
        {
          enforce: "pre",
          test: /\.s(c)ss/,
          loader: "import-glob-loader",
        },
        {
          test: /\.(js|jsx|ts|tsx)$/,
          exclude: /node_modules/,
          use: ["babel-loader"], //
        },

        {
          test: /\.(sa|sc|c)ss$/,
          use: [
            devMode ? "style-loader" : MiniCssExtractPlugin.loader,
            "css-loader",
            "postcss-loader",
            "sass-loader",
          ],
        },

        {
          test: /\.(png|jpg|gif)$/,
          use: ["url-loader"],
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf|svg)$/,
          use: ["file-loader"],
        },
      ],
    },
    resolve: {
      // Webpack 5 Change: Polyfill Node bindings. (https://webpack.js.org/blog/2020-10-10-webpack-5-release/#automatic-nodejs-polyfills-removed)
      // See https://github.com/webpack/webpack/pull/8460
      // See https://github.com/webpack/node-libs-browser/blob/master/index.js
      // required by @apidevtools/json-schema-ref-parser
      fallback: {
        buffer: "buffer",
        util: false, // It seems it is not required.
      },
      modules: [path.resolve(__dirname, "src"), "node_modules"],
      extensions: [".js", ".jsx", ".json", ".yml", ".tsx", ".ts"],
      alias: {
        cldr$: "cldrjs",
        cldr: "cldrjs/dist/cldr",
      },
    },
  };
};
