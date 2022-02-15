const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const WebpackBuildNotifierPlugin = require("webpack-build-notifier");
const GenerateJsonPlugin = require("generate-json-webpack-plugin");
const Dotenv = require("dotenv-webpack");

const manifest = require("./public/manifest.json");

const themeAntd = require("./src/themeAntd");
module.exports = {
  devtool: "inline-source-map",
  mode: "development",
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].[hash].bundle.js",
    publicPath: "/",
  },
  module: {
    rules: [
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        use: [{ loader: "babel-loader" }],
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.less$/,
        use: [
          { loader: "style-loader" },
          { loader: "css-loader" },
          {
            loader: "less-loader",
            options: {
              // modifyVars: less,
              modifyVars: themeAntd,
              lessOptions: {
                strictMath: true,
              },
              javascriptEnabled: true,
            },
          },
        ],
      },
      {
        test: /\.(png|jpg)$/,
        use: {
          loader: "file-loader",
          options: {
            name: "[name].[hash].[ext]",
            outputPath: "imgs",
          },
        },
      },
      {
        test: /\.html$/,
        use: ["html-loader"],
      },
      {
        test: /\.svg$/,
        use: {
          loader: "@svgr/webpack",
          options: {
            name: "[name].[hash].[ext]",
            outputPath: "svgs",
          },
        },
      },
    ],
  },
  optimization: {
    moduleIds: "hashed",
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
          chunks: "all",
        },
      },
    },
    runtimeChunk: "single",
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html",
      title: "Caching",
      favicon: "./public/SHMart.png",
    }),
    new Dotenv({
      path: "./configHost.env",
    }),
    new GenerateJsonPlugin("manifest.json", manifest),
    new WebpackBuildNotifierPlugin({
      suppressCompileStart: false,
      suppressSuccess: true,
      logo: path.resolve("./public/SHMart.png"),
    }),
  ],
  devServer: {
    stats: {
      children: false, // Hide children information
      maxModules: 0, // Set the maximum number of modules to be shown
    },
    historyApiFallback: true,
    port: 8080,
    hot: true,
    hotOnly: true,
  },
};
