
//  webpack.config.js

//  const active_app_file = "sec012a_app.jsx";
  const active_app_file = "sec012a_app.js";

console.log (' ******** active_app_file is ->' + active_app_file);

const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const WebpackMd5Hash = require('webpack-md5-hash');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const CopyWebpackPlugin = require('copy-webpack-plugin')

//  Turn these on as needed.
//const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
//const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const path = require ('path');
const webpack = require ('webpack');

const path_public = path.join (__dirname, 'public');
const path_dist = path.join (__dirname, 'dist');
const path_favicon = path.join (__dirname, 'public', 'images');
const path_favicon_dest = path.join (__dirname, 'images');
const source_JSX = path.join (__dirname, 'src', active_app_file);
const index_html_template = path.join (__dirname, 'src', 'index.html');

//  Try using resolve instead of join:
// const path_public = path.resolve (__dirname, 'public');
// const path_dist = path.resolve (__dirname, 'dist');
// const path_favicon = path.resolve (__dirname, 'public', 'images');
// const source_JSX = path.resolve (__dirname, 'src', active_app_file);
// const index_html_template = path.resolve (__dirname, 'src', 'index.html');

//  const path_styles = path.join (__dirname, 'src', 'styles');


//  This did not work
//  const source_JSX = "K:\\A01_Udemy\\Budget-app_03\\src\\sec012a_app.js";
//  const index_html_template = "K:\\A01_Udemy\\Budget-app_03\\src\\index.html";
//  This did not work
// const source_JSX = "K:/A01_Udemy/Budget-app_03/src/sec012a_app.js";
// const index_html_template = "K:/A01_Udemy/Budget-app_03/src/index.html";


//  SEC_015 --- 155. Creating a Separate Test Database 21:15
process.env.NODE_ENV = process.env.NODE_ENV || "development";

if (process.env.NODE_ENV === "test")  {
  console.log (` ******** process.env.NODE_ENV is "${process.env.NODE_ENV}"`);
  require('dotenv').config( { path: '.env.test' } );
}
else if (process.env.NODE_ENV === "development")  {
  console.log (` ******** process.env.NODE_ENV is "${process.env.NODE_ENV}"`);
  require('dotenv').config( { path: '.env.development' } );
}
else
  console.log (` ******** process.env.NODE_ENV is "${process.env.NODE_ENV}"`);

console.log (` ******** process.env.FIREBASE_AUTH_DOMAIN is "${process.env.FIREBASE_AUTH_DOMAIN}"`);
console.log (` ******** process.env.FIREBASE_DATABASE_URL is "${process.env.FIREBASE_DATABASE_URL}"`);
console.log (` ******** process.env.FIREBASE_PROJECT_ID is "${process.env.FIREBASE_PROJECT_ID}"`);
console.log (` ******** process.env.FIREBASE_STORAGE_BUCKET is "${process.env.FIREBASE_STORAGE_BUCKET}"`);
console.log (` ******** process.env.FIREBASE_MESSAGING_SENDER_ID is "${process.env.FIREBASE_MESSAGING_SENDER_ID}"`);

console.log (' --- path is ', __dirname);
console.log ( ' --- path_public is ', path_public);
console.log ( ' --- path_dist is ', path_dist);
console.log ( ' --- path_favicon is ', path_favicon);
console.log ( ' --- path_favicon_dest is ', path_favicon_dest);
console.log ( ' --- source_JSX is ', source_JSX);
console.log ( ' --- index_html_template is ', index_html_template);

//=======================================================================

    const loader_with_source_map = (P_loader) =>
    {
        return ( { loader: P_loader, options: { sourceMap: true } } );
    }

    const copy_webpack_plugin = () =>
    {
        return new CopyWebpackPlugin (
                //[ {from:'src/images', to:'images'} ], { copyUnmodified: true }
                [ {from: path_favicon, to: path_favicon_dest} ],
                { copyUnmodified: true }
            );
    }

    const HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
                  inject: 'body',
                  hash: true,
                  template: index_html_template,
                  filename: 'index.html',
                  favicon: path_favicon + '/favicon.png'
            });



function build_config (env)  {

//  SEC_015 --- 155. Creating a Separate Test Database 21:15
    const LF_new_webpack_define_plugin = () => {
      //[ LF_new_webpack_define_plugin ref1;]
            //[S07251664|A01_DIrectory_01.txt::webpack.DefinePlugin drc1;^B]
            return new webpack.DefinePlugin ( {
                'process.env.FIREBASE_API_KEY': JSON.stringify(process.env.FIREBASE_API_KEY),
                'process.env.FIREBASE_AUTH_DOMAIN': JSON.stringify(process.env.FIREBASE_AUTH_DOMAIN),
                'process.env.FIREBASE_DATABASE_URL': JSON.stringify(process.env.FIREBASE_DATABASE_URL),
                'process.env.FIREBASE_PROJECT_ID': JSON.stringify(process.env.FIREBASE_PROJECT_ID),
                'process.env.FIREBASE_STORAGE_BUCKET': JSON.stringify(process.env.FIREBASE_STORAGE_BUCKET),
                'process.env.FIREBASE_MESSAGING_SENDER_ID': JSON.stringify(process.env.FIREBASE_MESSAGING_SENDER_ID)
            } );
    };

    const build_config_obj =
    {
        entry: source_JSX,
        output:
        {
            // publicPath: '/',
            // chunkFilename: '[name].[chunkhash].js',
            // error filename: '[name].[chunkhash].js'
            filename: '[name].[hash].js'
        },
        module:
        {
            rules :
            [
              {
                loader: 'babel-loader',
                test: /\.jsx?$/,
                exclude: /node_modules/
              },
                {
                    test: /\.s?css$/,
                    use:
                    [
                        'style-loader',
                        MiniCssExtractPlugin.loader,
                        loader_with_source_map('css-loader'),
                        loader_with_source_map('postcss-loader'),
                        loader_with_source_map('sass-loader')
                    ]
                },
                {
                   test: /\.(jpg|jpeg|gif|png|ico)$/,
                   exclude: /node_modules/,
                   loader:'file-loader?name=img/[path][name].[ext]&context=./app/images'
                }
            ]
        },
        optimization: {
          // minimizer: [new UglifyJsPlugin()]
        },
        plugins:
        [
            //  https://github.com/jmblog/how-to-optimize-momentjs-with-webpack
            // load `moment/locale/ja.js` and `moment/locale/it.js`
            new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /ja|it/),

            // Ignore all locale files of moment.js
            new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),

            new CleanWebpackPlugin(path_dist, {} ),

            new MiniCssExtractPlugin({
                  filename: 'style.[contenthash].css',
            }),
            HtmlWebpackPluginConfig,
            new WebpackMd5Hash(),

            copy_webpack_plugin (),
            LF_new_webpack_define_plugin ()
        ]
    };


    console.log (`env --- ${env}`)

//    mode: "development",
//    mode: "production",
//    mode: "none",

    if (env === 'production')
    {
        build_config_obj.devtool = 'source-map';
        build_config_obj.mode = "production";
        build_config_obj.output.path = path_dist;
        //build_config_obj.output.path = path_public;

        build_config_obj.optimization.splitChunks =
        {
              // include all types of chunks
            chunks: 'all'
        }

 //  https://www.npmjs.com/package/webpack-bundle-analyzer

        // USE THIS to generate HTML representation in browser.
        //build_config_obj.plugins.push(new BundleAnalyzerPlugin());

        // USE THIS to generate JSON file.
        // build_config_obj.plugins.push(new BundleAnalyzerPlugin(
        // {
        //     analyzerMode: "disabled",
        //     generateStatsFile: true,
        //     statsFilename: "BundleAnalyzer_01.json",
        //     defaultSizes: "parsed"
        // }
        //  ) );
    }
    else
    if (env === 'development')
    {
        //build_config_obj.devtool = 'cheap-module-eval-source-map';
        build_config_obj.devtool = 'inline-source-map';
        build_config_obj.mode = "development";
        build_config_obj.output.path = path_public;

        build_config_obj.devServer = {
            //contentBase: dist_path,
            contentBase: path_public,
            host: "0.0.0.0",
            port: 9903,

            historyApiFallback: true,
            watchContentBase: true,
            watchOptions: { poll: true },

            //  Enabling Error Overlay
            //  WDS provides an overlay for capturing
            //  compilation related warnings and errors:
            //  https://survivejs.com/webpack/developing/webpack-dev-server/
            overlay: true,

            // publicPath: '/dist/'
            // publicPath: '/'
        };
    }
    else
        console.log (`   *** BAD PARAMETER for env: ${env}`)

    return build_config_obj;
};
//   END: function build_config (env)


module.exports = build_config;
