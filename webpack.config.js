module.exports = {
    target: "webworker",
    entry: "./index.js",
    module: {
        rules: [
            {
                test: /\.in$/i,
                use: 'raw-loader'
            }
        ]
    },
    plugins: []
}
