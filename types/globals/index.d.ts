interface ConfigType {
  contract: {
    nodeUrl: string,
    chainId: string,
  },
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

declare module "copy-webpack-plugin";
