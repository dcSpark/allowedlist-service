import typescriptIsTransformer from "typescript-is/lib/transform-inline/transformer";
import config from "config";
import webpack from "webpack";
import path from "path";
import CopyPlugin from "copy-webpack-plugin";
import Dotenv from "dotenv-webpack";
import nodeExternals from "webpack-node-externals";

const { NODE_ENV = "production" } = process.env;

module.exports = {
    entry: "./src/index.ts",
    //watch: NODE_ENV === "production",
    mode: NODE_ENV,
    target: "node",
    output: {
        path: path.resolve(__dirname, "build"),
        filename: "index.js",
    },
    // exclude external modules from build process
    externals: [nodeExternals({ modulesDir: "./" })],
    resolve: {
        extensions: [".ts", ".js", ".json"],
    },
    plugins: [
        // new webpack.DefinePlugin({ CONFIG: JSON.stringify(config) }),
        new webpack.IgnorePlugin({
            resourceRegExp: /^electron$/,
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
        // new Dotenv({ systemvars: true }),
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
