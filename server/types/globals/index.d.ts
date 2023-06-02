interface ConfigType {
    sidechain: {
        nodeUrl: string;
        bridgeProxyContract: string;
        bridgeLogicContract: string;
        erc20Contract: string;
        chainId: number;
    };
    API: {
        port: number;
        mainnet: string;
        cacheIntervalMs: number;
        allowedAddressesCSV: string;
        milkomedaDeployment: MilkomedaDeployment
    };
}

enum MilkomedaDeployment {
    A1 = "A1",
    C1 = "C1"
}

declare module "copy-webpack-plugin";
