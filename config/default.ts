export default ({ 
    APIGenerated: {
      port: process.env.PORT || 3000,
      enforceWhitelist: process.env.WHITELIST || "FALSE",
    }
  } as ConfigType);