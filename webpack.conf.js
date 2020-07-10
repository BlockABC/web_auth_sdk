const dotenv = require('dotenv')
const fs = require('fs')
const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

// Load dotenv files for environments
let environments = {}
for (const envFile of ['.development.env', '.env']) {
  try {
    environments = Object.assign(environments, dotenv.parse(fs.readFileSync(path.resolve(process.cwd(), envFile))))
  }
  catch (err) {
    if (envFile === '.env' && err.code === 'ENOENT') {
      continue
    }
    throw err
  }
}

// If process.env[key] is already exists, never replace it.
Object.keys(environments).forEach(function (key) {
  if (!Object.prototype.hasOwnProperty.call(process.env, key)) {
    process.env[key] = environments[key]
  }
})

const libName = 'webauth'
const srcDir = path.resolve(__dirname, 'src')
const distDir = path.resolve(__dirname, 'dist')
const exampleDir = path.resolve(__dirname, 'example')

module.exports = function (env = {}, argv) {
  // env 来自于 https://webpack.js.org/api/cli/#environment-options
  // argv 是 webpack 启动参数，其中 mode 来自于 --mode 参数
  const PROD = argv.mode === 'production'

  const config = {
    mode: argv.mode,
    entry: path.join(srcDir, 'index.ts'),
    target: 'web',
    resolve: {
      mainFields: ['browser', 'module', 'main'],
      extensions: ['.ts', '.js', '.json'],
    },
    output: {
      path: distDir,
      filename: `${libName}.umd.js`,
      libraryTarget: 'umd',
      library: libName,
    },
    optimization: {
      minimize: false
    },
    devtool: false,
    module: {
      rules: [{
        test: /\.(js|ts)$/,
        include: [srcDir],
        use: {
          loader: 'ts-loader',
          options: {
            transpileOnly: true,
            onlyCompileBundledFiles: true
          }
        }
      } ]
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env': JSON.stringify({
          PROD,
        })
      }),
    ],
  }

  if (PROD) {
    // 生成 .min 格式
    const minifiedConfig = merge(config, {
      output: {
        filename: `${libName}.umd.min.js`
      },
      optimization: {
        minimize: true
      },
      devtool: 'source-map',
    })

    // 生成 bundle 分析报告
    if (env.analysis) {
      minifiedConfig.plugins.push(new BundleAnalyzerPlugin())
    }

    return [config, minifiedConfig]
  }
  else {
    // config.watch = true
    config.devServer = {
      host: process.env.HOST,
      port: process.env.PORT,
      disableHostCheck: true,
      serveIndex: true,
      publicPath: '/static/',
      watchContentBase: true,
      contentBase: [
        exampleDir,
        distDir
      ],
    }

    return config
  }
}
