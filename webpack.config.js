const path = require('path');

module.exports = {
   mode: 'production',
   entry: './src/ts/index.ts',
   module: {
      rules: [
         {
            test: /\.ts?$/,
            use: 'ts-loader',
            exclude: /node_modules/,
         },
         {
            test: /\.s[ac]ss$/i,
            use: [
               'style-loader', 'css-loader', 'sass-loader'
            ]
         },
         {
            test: /\.svg?$/,
            loader: 'file-loader'
         }
      ],
   },
   resolve: {
      extensions: [ '.tsx', '.ts', '.js' ],
   },
   output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'dist'),
   },
   watch: true
};