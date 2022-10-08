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
            // '/api': {
            //     target: 'http://39.100.48.36:3012/',
            //     ws: true,
            //     changOrigin: true,
            //     pathRewrite: {
            //         '^/api': ''
            //     }
            // },
            '/local_api': {
                target: 'http://localhost:5000/api/v1.0/',
                ws: true,
                changOrigin: true,
                pathRewrite: {
                    '^/local_api': ''
                }
            },
            // '/localapi': {
            //     target: 'http://localhost:5000/',
            //     ws: true,
            //     changOrigin: true,
            //     pathRewrite: {
            //         '^/localapi': '/api'
            //     }
            // }
        },
        before: app => { }
    }
};
