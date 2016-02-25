var webpack = require('webpack');

module.exports = {
  output: {
    library: 'ReduxFavicon',
    libraryTarget: 'umd'
  },

  externals: {
    "react": {
      root: 'React',
      commonjs2: 'react',
      commonjs: 'react',
      amd: 'react'
    },
    'react-dom': {
      root: 'ReactDOM',
      commonjs2: 'react-dom',
      commonjs: 'react-dom',
      amd: 'react-dom'
    }
  },

  module: {
    loaders: [
      {
        test:     /\.js$/,
        loader:   'babel',
        exclude:  /node_modules/,
        include:  /src/
      }
    ]
  },

  resolve: {
    extensions: ['', '.js']
  }
}
