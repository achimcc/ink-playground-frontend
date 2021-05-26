const path = require("path");
const HtmlWebPackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "development",
  entry: {
    app: "./index.tsx",
    ra: "./workers/ra-worker.ts",
    "editor.worker": "monaco-editor/esm/vs/editor/editor.worker.js",
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
      // Handle our worker
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  output: {
    globalObject: "self",
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
  plugins: [
    new HtmlWebPackPlugin({
      title: "Rust Analyzer",
      template: "./index.html",
    }),
  ],
  // It is needed for firefox works
  devServer: {
    headers: {
      "Cross-Origin-Embedder-Policy": "require-corp",
      "Cross-Origin-Opener-Policy": "same-origin",
    },
  },
};
