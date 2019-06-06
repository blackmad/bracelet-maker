module.exports = {
    watch: true,
    entry: "./src/new-playground/frontend.ts",
    output: {
        filename: "main.js",
    },

    mode: "development",

    // Enable sourcemaps for debugging webpack's output.
    devtool: "source-map",

    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: [".webpack.js", ".web.js", ".ts", ".tsx", ".js"],
        alias: { fs: 'pdfkit/js/virtual-fs.js'}
    },

    module: {
        rules: [
            // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
            { test: /\.tsx?$/, loader: "awesome-typescript-loader" },
            { test: /\.js$/, exclude: /node_modules/, loader: "source-map-loader", enforce: "pre" },

            // pdfkit ridiculousness
            { enforce: 'post', test: /fontkit[/\\]index.js$/, loader: "transform-loader?brfs" },
            { enforce: 'post', test: /unicode-properties[/\\]index.js$/, loader: "transform-loader?brfs" },
            { enforce: 'post', test: /linebreak[/\\]src[/\\]linebreaker.js/, loader: "transform-loader?brfs" },
            { test: /src[/\\]assets/, loader: 'arraybuffer-loader'},
            { test: /\.afm$/, loader: 'raw-loader'},

            {
                test:/\.css$/,
                use:['style-loader','css-loader']
            }
        ]
    }
};
