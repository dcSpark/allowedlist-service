import typescriptIsTransformer from "typescript-is/lib/transform-inline/transformer";
import webpack from "webpack";
import path from "path";
import WebpackShellPluginNext from "webpack-shell-plugin-next";
import CopyPlugin from "copy-webpack-plugin";
import nodeExternals from "webpack-node-externals";

const { NODE_ENV = "production" } = process.env;

module.exports = {
    entry: "./src/index.ts",
    watch: NODE_ENV === "development",
    mode: NODE_ENV,
    target: "node",
    output: {
        path: path.resolve(__dirname, "build"),
        filename: "index.js",
    },
    resolve: {
        extensions: [".ts", ".js", ".json"],
    },
    // exclude external modules from build process
    externals: [nodeExternals({ allowlist: [/^dotenv/] })],
    plugins: [
        new webpack.IgnorePlugin({
            resourceRegExp: /^electron$/,
        }),
        new WebpackShellPluginNext({
            onBuildEnd: {
                scripts: ["npm run dev:run"],
                blocking: false,
                parallel: true,
            },
        }),
        new CopyPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, "contract"),
                    to: path.resolve(__dirname, "build/contract"),
                },
                {
                    from: path.resolve(__dirname, "files"),
                    to: path.resolve(__dirname, "build/files"),
                },
            ],
        }),
    ],
    module: {
        rules: [
            {
                use: {
                    loader: "ts-loader",
                    options: {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        getCustomTransformers: (program: any) => ({
                            before: [typescriptIsTransformer(program)],
                        }),
                    },
                },
                exclude: /node_modules/,
            },
        ],
    },
};
