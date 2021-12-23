interface ConfigType {
  APIGenerated: {
    port: number,
    enforceWhitelist: string,
    mainnet: string,
  },
}

declare global {
    namespace NodeJS {
      interface Global {
        ALLOWEDLIST: strign[];
      }
    }
  }