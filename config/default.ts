export default {
  sidechain: {
    nodeUrl: process.env.CONTRACT_HOST || "http://10.48.2.190:8545",
    address: process.env.CONTRACT_ADDRESS || "0x0000000000000000000000000000000000008888",
    accountIngress: "./contract/AccountIngress.json",
    accountRulesList: "./contract/AccountRulesList.json",
    
  },
  APIGenerated: {
    port: process.env.PORT || 3000,
    enforceWhitelist: process.env.WHITELIST || "FALSE",
    mainnet: process.env.MAINNET || "FALSE",
  },
} as ConfigType;
