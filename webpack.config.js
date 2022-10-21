//webpack.config.js
const path = require('path');

module.exports = {
  mode: "development",
  devtool: "inline-source-map",
  entry: {
    main: "./src/panel/main.ts",
  },
  output: {
    path: path.resolve(__dirname, './media'),
    filename: "[name]-bundle.js",
    library: {
      name: 'codachiApp',
      type: 'global'
    }
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
  },
  module: {
    rules: [
      { 
        test: /\.ts?$/,
        use: [
          {
            loader: "ts-loader",
            options: {
              configFile : 'tsconfig.panel.json'
            }
          }
        ]
      }
    ]
  },
};