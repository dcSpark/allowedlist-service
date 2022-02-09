export default {
    sidechain: {
        nodeUrl: process.env.CONTRACT_HOST || "wss://rpc.c1.milkomeda.com:8546",
        accountIngressAddress: process.env.ALLOW_LIST_CONTRACT_ADDRESS || "0x0000000000000000000000000000000000008888",
        chainId: process.env.BRIDGE_CONTRACT_CHAIN_ID || 2001,
        accountIngress: "./contract/AccountIngress.json",
        accountRulesList: "./contract/AccountRulesList.json",
        bridgeProxyContract: "./contract/Proxy.json",
        bridgeLogicContract: "./contract/SidechainBridge.json",
    },
    API: {
        port: process.env.PORT || 3000,
        enforceWhitelist: process.env.WHITELIST || "FALSE",
        mainnet: process.env.MAINNET || "FALSE",
        cacheIntervalMs: 3600000 // update cache every hour
    },
} as ConfigType;
