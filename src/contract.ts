import assert from "assert";
import fs from "fs";
import Web3 from "web3";
import type { AbiItem } from "web3-utils";
import { isAddress } from "web3-utils";
import { Contract } from "web3-eth-contract";
import path from "path";
  
declare const CONFIG: ConfigType;

export class AllowedListContract {
    web3: Web3;
    ingressContract: Contract;
    allowedListContract!: Contract; // it can be undefined at first, cause if constructor fails it will never be initialized

    constructor() {
        this.web3 = new Web3(CONFIG.sidechain.nodeUrl);
        const accountIngress = JSON.parse(fs.readFileSync(path.resolve(__dirname, CONFIG.sidechain.accountIngress), "utf-8"));
        this.ingressContract = new this.web3.eth.Contract(accountIngress["abi"] as AbiItem[], CONFIG.sidechain.accountIngressAddress);
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
        return await this.allowedListContract.methods.getAccounts().call();
    }
}
export const contract = new AllowedListContract();