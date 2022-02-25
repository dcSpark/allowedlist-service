interface ConfigType {
    sidechain: {
        nodeUrl: string;
        accountIngressAddress: string;
        accountIngress: string;
        accountRulesList: string;
        bridgeProxyContract: string;
        bridgeLogicContract: string;
        chainId: number;
    };
    API: {
        port: number;
        enforceWhitelist: string;
        mainnet: string;
        cacheIntervalMs: number;
        requestRetries: number;
        requestRetriesMs: number;
    };
}

declare module "copy-webpack-plugin";
