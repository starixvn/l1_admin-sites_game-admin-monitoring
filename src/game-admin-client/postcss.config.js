module.exports = {
    plugins: {
        'postcss-url': {
            url: (asset) => {
                if (asset.url[0] === '/') {
                    return process.env['NEXT_PUBLIC_ROOT_URL'] + asset.url;
                }
                return asset.url;
            }
        }
    }
};