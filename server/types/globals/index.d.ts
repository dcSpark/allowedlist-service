interface ConfigType {
    sidechain: {
        nodeUrl: string;
        bridgeProxyContract: string;
        bridgeLogicContract: string;
        erc20Contract: string;
        chainId: number;
    };
    mainchain: {
        nodeUrl: string;
        apiKey: string;
    };
    API: {
        port: number;
        mainnet: string;
        cacheIntervalMs: number;
        allowedAddressesCSV: string;
        milkomedaDeployment: MilkomedaDeployment;
    };
}

declare module "copy-webpack-plugin";
