const nodeSass = require('node-sass');
const path = require("path");

module.exports = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.node = {
        fs: "empty",
      };
    }

    // config.resolve.alias['components'] = path.join(__dirname, 'components')

    // config.resolve.push({
    //   modules: [
    //     path.resolve(__dirname, "img"),
    //     "node_modules"
    //   ],
    // });

    config.module.rules.push({
      test: /\.(gif|png|jpg|jpeg)$/,
      loader: 'file-loader',
      options: {
        name: '[path][name].[ext]',
        outputPath: (file) => {
          const p = file.split('/game-admin/images/')[1];
          return p;
        },
      },
    })
    
    //   config.module.rules.push({
    //   test: /\.s[ac]ss$/i,
    //   use: [
    //     {
    //       loader: "css-loader",
    //     },
    //     {
    //       loader: "resolve-url-loader",
    //     },
    //     {
    //       loader: "sass-loader",
    //     },
    //   ],
    // })

    return config;
  },
  assetPrefix: "./",
  exportPathMap: async function (
    defaultPathMap,
    { dev, dir, outDir, distDir, buildId }
  ) {
    return {
      "/monitor": { page: "/" }
    };
  }
};
