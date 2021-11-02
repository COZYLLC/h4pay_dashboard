//const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const CompressionPlugin = require('compression-webpack-plugin')

module.exports = {
        outputDir: "/synology/dist_dashboard",
        configureWebpack: {
                plugins: [
                        //new BundleAnalyzerPlugin(),
                        new CompressionPlugin({
                                algorithm: "gzip",
                        }),],
        }
}
