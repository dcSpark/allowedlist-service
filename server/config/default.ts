import dotenv from "dotenv";
import { MilkomedaDeployment } from "../../shared/types";

dotenv.config();

const getEnv = (key: string): string | undefined => {
    return process.env[key];
};

export default {
    sidechain: {
        nodeUrl: getEnv("CONTRACT_HOST") || "wss://rpc.c1.milkomeda.com:8546",
        chainId: getEnv("BRIDGE_CONTRACT_CHAIN_ID") || 2001,
        bridgeProxyContract: "./contract/Proxy.json",
        bridgeLogicContract: "./contract/SidechainBridge.json",
        erc20Contract: "./contract/ERC20.json",
    },
    API: {
        port: getEnv("PORT") || 3000,
        mainnet: getEnv("MAINNET") || "FALSE",
        cacheIntervalMs: 1800000, // update cache every hour
        allowedAddressesCSV: "./files/allowed_addresses.csv",
        milkomedaDeployment: getEnv("MILKOMEDA_DEPLOYMENT") || MilkomedaDeployment.C1
    },
} as ConfigType;
