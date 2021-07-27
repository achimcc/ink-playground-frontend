const path = require("path");
const MonacoWebpackPlugin = require("monaco-editor-webpack-plugin");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const BundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  mode: "production",
  entry: {
    app: "./index.tsx",
    ra: "./components/Editor/workers/ra-worker.ts",
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.ttf$/,
        use: ["file-loader"],
      },
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: ["/node_modules/", "/workers/"],
      },
      {
        test: /\.(png|gif|woff|woff2|eot|ttf|svg)$/,
        use: {
          loader: "url-loader",
          options: {
            limit: 100000,
          },
        },
      },
      // Handle our worker
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  output: {
    globalObject: "self",
    filename: (chunkData) => {
      switch (chunkData.chunk.name) {
        case "ra":
          return "ra-worker.ts";
        default:
          return "bundle.[contenthash].js";
      }
    },
    path: path.resolve(__dirname, "dist"),
  },
  plugins: [
    new MiniCssExtractPlugin(),
    new HtmlWebPackPlugin({
      title: "Rust Analyzer",
      template: "./index.html",
    }),
    new MonacoWebpackPlugin({
      // "filename" must match what we configure in output
      filename: "[name].[contenthash].bundle.js",
      languages: ["rust"],
    }),
    new CopyWebpackPlugin({
      patterns: [{ from: "components/Editor/data" }],
    }),
    // new BundleAnalyzerPlugin(),
  ],
  optimization: {
    splitChunks: {
      cacheGroups: {
        editor: {
          // Editor bundle
          test: /[\\/]node_modules\/(monaco-editor\/esm\/vs\/(nls\.js|editor|platform|base|language)|style-loader\/lib|css-loader\/lib\/css-base\.js)/,
          name: "monaco-editor",
          chunks: "async",
        },
        languages: {
          // Language bundle
          test: /[\\/]node_modules\/(monaco-editor\/esm\/vs\/(basic-languages)|\.js)/,
          name: "monaco-languages",
          chunks: "async",
        },
      },
    },
  },
  // It is needed for firefox works
  devServer: {
    headers: {
      "Cross-Origin-Embedder-Policy": "require-corp",
      "Cross-Origin-Opener-Policy": "cross-origin",
    },
  },
};
