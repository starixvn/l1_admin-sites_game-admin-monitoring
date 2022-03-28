const nodeSass = require('node-sass');

module.exports = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.node = {
        fs: "empty",
      };
    }

    config.module.rules.push({
      test: /\.scss$/,
      use: [
        {
          loader: "sass-loader",
          options: {
            functions: {
              "env($variable)": variable => {
                  const value = variable.getValue();
                  const envValue = process.env[value]
                  const sassValue = new nodeSass.types.String(envValue); 
                  return sassValue;
              }
          }
          }
        },
      ],
    })

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
  },
  images: {
    domains: ['https://l1-proxy1.lumigame.com/monitoring', 'https://l1uatproxy.sgamesuat.com/sit/monitoring'],
    formats: ['image/webp', 'image/jpeg', 'image/png', 'image/gif'],
  },
};
