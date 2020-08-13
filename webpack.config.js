const path = require('path')

var webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
    mode: 'development',
    entry: './src/js/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].bundle.js'
    },
    devServer: {
        contentBase: path.join(__dirname, "dist"),
        compress: true,
        port: 8081
    },
    module: {
        rules: [
            { 
                test:/\.css$/, 
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: '../'
                        }
                    },
                    'css-loader'
                ]
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude:__dirname+'node_modules',
                include:__dirname+'src',
                options: {
                    presets: ['env']
                }
            }

        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: '[name].min.css',
            chunkFilename: '[id].css'
        }),
        new HtmlWebpackPlugin({
            template:path.join(__dirname, './view/index.html')
        })
    ]

}