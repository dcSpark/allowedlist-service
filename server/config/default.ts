export default {
    sidechain: {
        nodeUrl: process.env.CONTRACT_HOST || "wss://rpc-mainnet-cardano-evm.c1.milkomeda.com",
        chainId: process.env.BRIDGE_CONTRACT_CHAIN_ID || 2001,
        bridgeProxyContract: "./contract/Proxy.json",
        bridgeLogicContract: "./contract/SidechainBridge.json",
    },
    API: {
        port: process.env.PORT || 3000,
        mainnet: process.env.MAINNET || "TRUE",
        cacheIntervalMs: 1800000, // update cache every 30 minutes
        allowedAddressesCSV: "./files/allowed_addresses.csv",
    },
} as ConfigType;
