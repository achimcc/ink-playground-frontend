const path = require("path");
const MonacoWebpackPlugin = require("monaco-editor-webpack-plugin");
const HtmlWebPackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "production",
  entry: {
    app: "./index.tsx",
    ra: "./workers/ra-worker.ts",
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
    filename: (chunkData) => {
      switch (chunkData.chunk.name) {
        case "ra":
          return "ra-worker.ts";
        default:
          return "bundle.[hash].js";
      }
    },
    path: path.resolve(__dirname, "dist"),
  },
  plugins: [
    new HtmlWebPackPlugin({
      title: "Rust Analyzer",
      template: "./index.html",
    }),
    new MonacoWebpackPlugin(),
  ],
  // It is needed for firefox works
  devServer: {
    headers: {
      "Cross-Origin-Embedder-Policy": "require-corp",
      "Cross-Origin-Opener-Policy": "same-origin",
    },
  },
};
