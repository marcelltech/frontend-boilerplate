const HtmlWebpackPlugins = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const TerserJSPlugin = require("terser-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

// This is how we manage the development mode, using an environment node.js avariable
const isDevelopment = process.env.NODE_ENV === "development";

// This is main configuration object.
// Here you write different options and tell Webpack what to do
module.exports = {
  optimization: {
    minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})]
  },
  // Default mode for Webpack is production.
  // Depending on mode Webpack will apply different things on final bundle.
  mode: isDevelopment ? "development" : "production",
  // Path to your entry point. From this file Webpack will begin his work
  entry: "./src/js/Index.js",
  output: {
    filename: isDevelopment ? "bundle.js" : "bundle.[hash].js"
  },
  devServer: {
    port: 3000
  },
  module: {
    rules: [
      {
        // Apply rule for .js or .jsx files
        test: /\.jsx?$/,
        use: "babel-loader",
        exclude: /node_modules/
      },
      {
        // Apply rule for .html files
        test: /\.html$/,
        use: [
          {
            loader: "html-loader",
            options: { minimize: !isDevelopment }
          }
        ]
      },
      {
        // Apply rule for .sass, .scss or .css files (modules)
        test: /\.module\.s(a|c)ss$/,
        use: [
          isDevelopment ? "style-loader" : MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              modules: {
                localIdentName: "[name]__[local]__[hash:base64:5]"
              },
              localsConvention: "camelCase",
              sourceMap: isDevelopment
            }
          },
          {
            loader: "sass-loader",
            options: {
              sourceMap: isDevelopment
            }
          }
        ]
      },
      {
        // Apply rule for .sass, .scss or .css files
        test: /\.s(a|c)ss$/,
        exclude: /\.module.(s(a|c)ss)$/,
        // Set loaders to transform files.
        // Loaders are applying from right to left(!)
        // The first loader will be applied after others
        use: [
          // After all CSS loaders we use plugin MiniCssExtractPlugin to do his work.
          // It gets all transformed CSS and extracts it into separate single bundled file
          // only used in production mode
          isDevelopment ? "style-loader" : MiniCssExtractPlugin.loader,
          // This loader resolves url() and @imports inside CSS
          "css-loader",
          {
            // First we transform SASS to standard CSS
            loader: "sass-loader",
            options: {
              sourceMap: isDevelopment
            }
          }
        ]
      },
      {
        // Apply rule for .gif, .png, .jpg, .jpeg or .svg files
        test: /\.(gif|png|jpe?g|svg)$/i,
        use: [
          {
            // Using file-loader for these files
            loader: "file-loader",
            // In options we can set different things like format and directory to save
            options: {
              name: isDevelopment
                ? "[name].[ext]"
                : "[sha512:hash:base64:7].[ext]",
              outputPath: "img"
            }
          },
          {
            loader: "image-webpack-loader",
            options: {
              mozjpeg: {
                progressive: true,
                quality: 65
              },
              optipng: {
                enabled: !isDevelopment
              },
              pngquant: {
                quality: "65-90",
                speed: 4
              },
              gifsicle: {
                interlaced: false
              },
              webp: {
                quality: 75
              }
            }
          }
        ]
      },
      {
        // Apply rule for fonts files
        test: /\.(woff|woff2|ttf|otf|eot)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              outputPath: "fonts"
            }
          }
        ]
      }
    ]
  },
  resolve: {
    extensions: [
      ".js",
      ".jsx",
      ".scss",
      ".gif",
      ".png",
      ".jpg",
      ".jpeg",
      ".svg"
    ]
  },
  plugins: [
    new HtmlWebpackPlugins({
      template: "./src/index.html",
      filename: "./index.html"
    }),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: isDevelopment ? "bundle.css" : "bundle.[hash].css",
      chunkFilename: isDevelopment ? "[id].css" : "[id].[hash].css"
    })
  ]
};
