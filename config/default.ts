export default {
  contract: {
    nodeUrl: process.env.CONTRACT_HOST || "http://localhost:8545",
    chainId: process.env.CHAIN_ID || "1000"
  },
  APIGenerated: {
    port: process.env.PORT || 3000,
    enforceWhitelist: process.env.WHITELIST || "FALSE",
    mainnet: process.env.MAINNET || "FALSE",
  },
} as ConfigType;
