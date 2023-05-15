export default {
    sidechain: {
        nodeUrl: process.env.CONTRACT_HOST || "wss://rpc.c1.milkomeda.com:8546",
        chainId: process.env.BRIDGE_CONTRACT_CHAIN_ID || 2001,
        bridgeProxyContract: "./contract/Proxy.json",
        bridgeLogicContract: "./contract/SidechainBridge.json",
        erc20Contract: "./contract/ERC20.json",
    },
    API: {
        port: process.env.PORT || 3000,
        mainnet: process.env.MAINNET || "FALSE",
        cacheIntervalMs: 1800000, // update cache every hour
        allowedAddressesCSV: "./files/allowed_addresses.csv",
    },
} as ConfigType;
