export default {
  sidechain: {
    nodeUrl: process.env.CONTRACT_HOST || "https://rpc.c1.milkomeda.com:8545",
    accountIngressAddress: process.env.CONTRACT_ADDRESS || "0x0000000000000000000000000000000000008888",
    accountIngress: "./contract/AccountIngress.json",
    accountRulesList: "./contract/AccountRulesList.json",
    bridgeProxyContract: "./contract/Proxy.json",
    bridgeLogicContract: "./contract/SidechainBridge.json",
  },
  APIGenerated: {
    port: process.env.PORT || 3000,
    enforceWhitelist: process.env.WHITELIST || "FALSE",
    mainnet: process.env.MAINNET || "FALSE",
  },
} as ConfigType;
