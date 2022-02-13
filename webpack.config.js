const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');//费时分析
const smp = new SpeedMeasurePlugin();
console.log('process.env.NODE_ENV=', process.env.NODE_ENV) // 打印环境变量
const config = {
  entry: {
    index: path.resolve(__dirname, './src/index.js'),
    header: path.resolve(__dirname, './src/header.js'),
  },    // 入口文件
  output: {
    filename: '[name][hash:8].js',      // 打包后的文件名称
    path: path.resolve(__dirname, './dist'),  // 打包后的目录
    // publicPath: './'
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './public/index.html'),
      filename: 'index.html',
      chunks: ['index']
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './public/header.html'),
      filename: 'header.html',
      chunks: ['header']
    }),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({ // 添加插件
      filename: '[name].[hash:8].css'
    }),
  ],
  // asset/resource 将资源分割为单独的文件，并导出 url，类似之前的 file-loader 的功能.
  // asset/inline 将资源导出为 dataUrl 的形式，类似之前的 url-loader 的小于 limit 参数时功能.
  // asset/source 将资源导出为源码（source code）. 类似的 raw-loader 功能.
  // asset 会根据文件大小来选择使用哪种类型，当文件小于 8 KB（默认） 的时候会使用 asset/inline，否则会使用 asset/resource
  module: {
    rules: [
      // {
      //   test: /\.css$/, //匹配所有的 css 文件
      //   use: ['style-loader', 'css-loader', 'postcss-loader']
      // },
      {
        test: /\.less|css$/, //匹配所有的 css 文件
        use: [
          // 'style-loader',//将样式用style包裹起来添加到头部
          MiniCssExtractPlugin.loader,//link形式引入
          'css-loader',
          'postcss-loader',
          'less-loader']
      },
      {//配置图片
        test: /\.(jpe?g|png|gif)$/i,
        type: 'asset',
        generator: {
          filename: "[name][hash:8][ext]"
        },
        parser: {
          dataUrlCondition: {
            maxSize: 5 * 1024 * 1024
          }
        }
      },
      {
        test: /\.js$/i,
        use: [{
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env'
            ],
          }
        }]
      }
    ]
  },
  devtool: 'source-map',//SourceMap 是一种映射关系，当项目运行后，如果出现错误，我们可以利用 SourceMap 反向定位到源码位置
  devServer: {
    port: 3000,//端口
    compress: true,//是否启动压缩
    // contentBase: path.resolve(__dirname, './public'),//最新版本已经被移除取而代之是 static: false,该配置项允许配置从目录提供静态文件的选项（默认是 'public' 文件夹）。将其设置为 false 以禁用：
    static: false,
    open: true,//是否自动打开浏览器
  }
}
module.exports = (env, argv) => {
  console.log('argv.mode=', argv.mode) // 打印 mode(模式) 值
  // 这里可以通过不同的模式修改 config 配置
  // return config;
  //新增费时分析
  return smp.wrap(config)
}