import assert from "assert";
import fs from "fs";
import Web3 from "web3";
import type { AbiItem } from "web3-utils";
import { isAddress, fromWei, stripHexPrefix } from "web3-utils";
import type { Contract } from "web3-eth-contract";
import path from "path";
import { WMAIN_ID } from "./utils";

declare const CONFIG: ConfigType;

export type TokensRegistry = {
    minLovelace: string;
    assets: AssetsDetails[];
};

export type AssetsDetails = {
    idCardano: string;
    idMilkomeda: string;
    minCNTInt?: string;
    minGWei?: string;
};
export class AllowedListContract {
    web3!: Web3;
    bridgeContract!: Contract;
    ingressContract!: Contract;
    allowedListContract!: Contract; // it can be undefined at first, cause if constructor fails it will never be initialized

    constructor() {
        // Service should start the REST API even if there's problem with initialization of the contracts
        // Hence, we handle error if any appears and proceed
        try {
            this.web3 = new Web3(CONFIG.sidechain.nodeUrl);
            const accountIngress = JSON.parse(fs.readFileSync(path.resolve(__dirname, CONFIG.sidechain.accountIngress), "utf-8"));
            this.ingressContract = new this.web3.eth.Contract(accountIngress["abi"] as AbiItem[], CONFIG.sidechain.accountIngressAddress);

            const bridgeLogicPath = path.resolve(__dirname, CONFIG.sidechain.bridgeLogicContract);
            const bridgeProxyPath = path.resolve(__dirname, CONFIG.sidechain.bridgeProxyContract);
            const bridgeLogic = JSON.parse(fs.readFileSync(bridgeLogicPath, "utf-8"));
            const bridgeProxy = JSON.parse(fs.readFileSync(bridgeProxyPath, "utf-8"));
            this.bridgeContract = new this.web3.eth.Contract(
                bridgeLogic["abi"] as AbiItem[],
                bridgeProxy["networks"][CONFIG.sidechain.chainId]["address"]
            );
        } catch (e) {
            console.error(e);
        }
    }

    public async initializeContract(): Promise<AllowedListContract> {
        const accountRulesList = JSON.parse(fs.readFileSync(path.resolve(__dirname, CONFIG.sidechain.accountRulesList), "utf-8"));
        const ruleContractName = await this.ingressContract.methods.RULES_CONTRACT().call();
        const accountRulesAddress = await this.ingressContract.methods.getContractAddress(ruleContractName).call();

        assert(isAddress(accountRulesAddress));
        this.allowedListContract = new this.web3.eth.Contract(accountRulesList["abi"] as AbiItem[], accountRulesAddress);
        return this;
    }

    public getAccountsList = async (): Promise<string[] | Error> => {
        try {
            const accounts = await this.allowedListContract.methods.getAccounts().call();
            return accounts;
        } catch (e) {
            const error = e as Error;
            console.error(error.message);
            return new Error(`Contract not initialized properly. Details: ${error.message}`);
        }
    };

    public getStargateAddress = async (): Promise<string[] | Error> => {
        try {
            const stargateAddress = await this.bridgeContract.methods.stargateAddress().call();
            return stargateAddress;
        } catch (e) {
            const error = e as Error;
            console.error(error.message);
            return new Error(`Contract not initialized properly. Details: ${error.message}`);
        }
    };

    public getAssetIds = async (): Promise<unknown> => {
        const assets = await this.bridgeContract.methods.getAssetIds().call();
        return assets;
    };

    public getTokenRegistryAllowedList = async (): Promise<TokensRegistry | Error> => {
        const assets = (await this.getAssetIds()) as string[];

        let assetsDetails: AssetsDetails[] = [];
        let adaMinValue = "2000000";
        for (let id of assets) {
            try {
                const details = await this.bridgeContract.methods.tokenRegistry(id).call();

                if (id === WMAIN_ID) {
                    // conversion to Lovelaces should appear only for milkADA
                    adaMinValue = fromWei(details.minimumValue, "microether"); // gives back microether = lovelace (for main asset),
                } else {
                    // if not WADA
                    assetsDetails.push({
                        idCardano: stripHexPrefix(id), // if 0x is there, then remove it
                        idMilkomeda: stripHexPrefix(details.tokenContract), // if 0x is there, then remove it
                        minCNTInt: fromWei(details.minimumValue),
                        minGWei: fromWei(details.minimumValue, "Gwei"),
                    });
                }
            } catch (e) {
                let err = e as Error;
                console.error(`Error when retrieving asset of id: ${id}.\nMore info:`);
                console.error(e);
                return err; // if something bad happens while fetching token registry, just return null
            }
        }

        const tokenRegistry: TokensRegistry = {
            minLovelace: adaMinValue,
            assets: assetsDetails,
        };
        return tokenRegistry;
    };
}

export const contract = new AllowedListContract();
