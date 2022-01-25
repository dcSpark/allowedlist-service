import assert from "assert";
import fs from "fs";
import Web3 from "web3";
import type { AbiItem } from "web3-utils";
import { isAddress } from "web3-utils";
import { Contract } from "web3-eth-contract";
import path from "path";
  
declare const CONFIG: ConfigType;

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
          this.bridgeContract = new this.web3.eth.Contract(bridgeLogic["abi"] as AbiItem[], bridgeProxy["networks"][CONFIG.sidechain.chainId]["address"]);
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

    public async getAccountsList(): Promise<string[] | Error> {
      try {
        return await this.allowedListContract.methods.getAccounts().call();
      } catch (e: any) {
        const error = e as Error;
        console.error(error.message);
        return new Error(`Contract not initialized properly. Details: ${error.message}`);
      }
    }

    public async getStargateAddress(): Promise<string[] | Error> {
      try {
        return await this.bridgeContract.methods.stargateAddress().call();
      } catch (e: any) {
        const error = e as Error;
        console.error(error.message);
        return new Error(`Contract not initialized properly. Details: ${error.message}`);
      }
    }
}
export const contract = new AllowedListContract();