interface ConfigType {
  sidechain: {
    nodeUrl: string,
    accountIngressAddress: string,
    accountIngress: string,
    accountRulesList: string,
  },
  APIGenerated: {
    port: number,
    enforceWhitelist: string,
    mainnet: string,
  },
}

declare module "copy-webpack-plugin";
