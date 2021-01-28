module.exports = {
    lintOnSave: false,
    transpileDependencies: [
        'vue-echarts',
        'resize-detector'
    ],
    devServer: {
        open: true,
        host: 'localhost',
        port: 8081,
        https: false,
        hotOnly: false,
        proxy: { // 配置跨域
            '/api': {
                target: 'http://39.100.48.36:3010/',
                ws: true,
                changOrigin: true,
                pathRewrite: {
                    '^/api': ''
                }
            }
        },
        before: app => { }
    }
};
