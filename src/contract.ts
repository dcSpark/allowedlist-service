import assert from "assert";
import fs from "fs";
import Web3 from "web3";
import type { AbiItem } from "web3-utils";
import { isAddress } from "web3-utils";
import type { Contract } from "web3-eth-contract";
import path from "path";

declare const CONFIG: ConfigType;

export class AllowedListContract {
    web3: Web3;
    allowedListContract: Contract;

    constructor() {
        this.web3 = new Web3(CONFIG.contract.nodeUrl);

        // todo move file directories to config 
        const accountRules = JSON.parse(fs.readFileSync(path.resolve(__dirname, "./contract/AccountRules.json"), "utf-8"));
        const accountRulesList = JSON.parse(fs.readFileSync(path.resolve(__dirname, "./contract/AccountRulesList.json"), "utf-8"));
        const chainId = CONFIG.contract.chainId;

        assert(isAddress(accountRules["networks"][chainId]["address"]));
        this.allowedListContract = new this.web3.eth.Contract(accountRulesList["abi"] as AbiItem[], accountRules["networks"][chainId]["address"]);
    }

    public async getAccountsList(): Promise<string[] | Error> {
        return await this.allowedListContract.methods.getAccounts().call();
    }
}
export const contract = new AllowedListContract();
