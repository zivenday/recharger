/*
 * @Author: zhongw@corp.21cn.com 
 * @Date: 2018-06-14 10:00:23 
 * @Last Modified by: zhongw@corp.21cn.com
 * @Last Modified time: 2018-06-18 00:27:59
 */
'use strict'
const path = require('path')
const utils = require('./utils')
const config = require('../config')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const vueLoaderConfig = require('./vue-loader.conf')

// const striptags = require('./strip-tag')
// const MarkdownItContainer = require('markdown-it-container')

// const vueMarkdown = {
//   preprocess: (MarkdownIt, source) => {
//     MarkdownIt.renderer.rules.table_open = function () {
//       return '<table class="table">'
//     }
//     MarkdownIt.renderer.rules.fence = utils.wrapCustomClass(MarkdownIt.renderer.rules.fence)

//     // ```html `` 给这种样式加个class hljs
//     //  但是markdown-it 有个bug fence整合attr的时候直接加载class数组上而不是class的值上
//     //  markdown-it\lib\renderer.js 71行 这么修改可以修复bug
//     //  tmpAttrs[i] += ' ' + options.langPrefix + langName; --> tmpAttrs[i][1] += ' ' + options.langPrefix + langName;
//     // const fence = MarkdownIt.renderer.rules.fence
//     // MarkdownIt.renderer.rules.fence = function(...args){
//     //   args[0][args[1]].attrJoin('class', 'hljs')
//     //   var a = fence(...args)
//     //   return a
//     // }

//     // ```code`` 给这种样式加个class code_inline
//     const code_inline = MarkdownIt.renderer.rules.code_inline
//     MarkdownIt.renderer.rules.code_inline = function (...args) {
//       args[0][args[1]].attrJoin('class', 'code_inline')
//       return code_inline(...args)
//     }
//     return source
//   },
//   use: [
//     [MarkdownItContainer, 'demo', {
//       validate: params => params.trim().match(/^demo\s*(.*)$/),
//       render: function (tokens, idx) {
//         // var m = tokens[idx].info.trim().match(/^demo\s*(.*)$/)

//         if (tokens[idx].nesting === 1) {
//           // var desc = tokens[idx + 2].content
//           const html = utils.convertHtml(striptags(tokens[idx + 1].content, 'script'))
//           // 移除描述，防止被添加到代码块
//           tokens[idx + 2].children = []

//           return `<demo-block>
//                         <div slot="desc">${html}</div>
//                         <div slot="highlight">`
//         }
//         return '</div></demo-block>\n'
//       }
//     }]
//   ]
// }

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

const createLintingRule = () => ({
  // test: /\.(js|vue)$/,
  // loader: 'eslint-loader',
  // enforce: 'pre',
  // include: [resolve('examples'), resolve('test')],
  // options: {
  //   formatter: require('eslint-friendly-formatter'),
  //   emitWarning: !config.dev.showEslintErrorsInOverlay
  // }
})

module.exports = {
  context: path.resolve(__dirname, '../'),
  entry: {
    docs: './examples/main.js',
    mobile: './examples/mobile.js'
    // app:'./packages/theme-default/index.scss'
  },
  output: {
    path: config.build.assetsRoot,
    filename: '[name].js',
    publicPath: process.env.NODE_ENV === 'production'
      ? config.build.assetsPublicPath
      : config.dev.assetsPublicPath
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': resolve('examples'),
      '@utils': resolve('examples/utils'),
      'utils': resolve('src/utils'),
      'assets': resolve('src/assets'),
      'recharger':resolve('')
    }
  },
  module: {
    rules: [
      ...(config.dev.useEslint ? [createLintingRule()] : []),
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [resolve('examples'), resolve('test'), resolve('packages'), resolve('node_modules/webpack-dev-server/client')]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('media/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.md/,
        use: [
          'vue-loader',
          'fast-vue-md-loader'
        ]
      }
    ]
  },
  plugins:[
    new HtmlWebpackPlugin({
      chunks: ['vendor', 'docs'],
      template: 'index.html',
      filename: 'index.html',
      inject: true
    }),
    new HtmlWebpackPlugin({
      chunks: ['vendor', 'mobile'],
      template: 'examples.html',
      filename: 'examples.html',
      inject: true
    }),
  ],
  node: {
    // prevent webpack from injecting useless setImmediate polyfill because Vue
    // source contains it (although only uses it if it's native).
    setImmediate: false,
    // prevent webpack from injecting mocks to Node native modules
    // that does not make sense for the client
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty'
  }
}