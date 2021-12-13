interface ConfigType {
  APIGenerated: {
    port: number
  },
}

declare global {
    namespace NodeJS {
      interface Global {
        ALLOWEDLIST: strign[];
      }
    }
  }