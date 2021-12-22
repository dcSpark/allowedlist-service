interface ConfigType {
  APIGenerated: {
    port: number,
    enforceWhitelist: string,
  },
}

declare global {
    namespace NodeJS {
      interface Global {
        ALLOWEDLIST: strign[];
      }
    }
  }