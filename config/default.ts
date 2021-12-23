export default ({ 
    APIGenerated: {
      port: process.env.PORT || 3000,
      enforceWhitelist: process.env.WHITELIST || "FALSE",
      mainnet: process.env.MAINNET || "FALSE",
    }
  } as ConfigType);