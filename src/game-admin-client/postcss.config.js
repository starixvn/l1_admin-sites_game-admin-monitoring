var configs = require("./configs.json");

module.exports = {
  plugins: {
    "postcss-url": {
      url: (asset) => {
        if (asset.url[0] === "/") {
          return configs.RootUrl + asset.url;
        }
        return asset.url;
      },
    },
  },
};
