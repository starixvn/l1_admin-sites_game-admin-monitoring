module.exports = {
    plugins: {
        'postcss-url': {
            url: (asset) => {
                if (asset.url[0] === '/') {
                    return process.env['ROOTURL'] + asset.url;
                }
                return asset.url;
            }
        }
    }
};