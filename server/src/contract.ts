import fs from "fs";
import Web3 from "web3";
import type { AbiItem } from "web3-utils";
import { fromWei, stripHexPrefix } from "web3-utils";
import type { Contract } from "web3-eth-contract";
import path from "path";
import { WMAIN_ID, convertToAssetId } from "./utils";
import type { MilkomedaStargateAsset } from "../../shared/types";
import CONFIG from "../config/default";

export type TokensRegistry = {
    minLovelace: string;
    assets: MilkomedaStargateAsset[];
    wrappingFee: string;
    unwrappingFee: string;
};

export class SidechainContract {
    web3!: Web3;
    bridgeContract!: Contract;
    erc20Abi!: AbiItem[];

    constructor() {
        // Service should start the REST API even if there's problem with initialization of the contracts
        // Hence, we handle error if any appears and proceed
        try {
            this.web3 = new Web3(CONFIG.sidechain.nodeUrl);

            const bridgeLogicPath = path.resolve(__dirname, CONFIG.sidechain.bridgeLogicContract);
            const bridgeProxyPath = path.resolve(__dirname, CONFIG.sidechain.bridgeProxyContract);
            const bridgeLogic = JSON.parse(fs.readFileSync(bridgeLogicPath, "utf-8"));
            const bridgeProxy = JSON.parse(fs.readFileSync(bridgeProxyPath, "utf-8"));
            this.bridgeContract = new this.web3.eth.Contract(
                bridgeLogic["abi"] as AbiItem[],
                bridgeProxy["networks"][CONFIG.sidechain.chainId]["address"]
            );

            const erc20AbiPath = path.resolve(__dirname, CONFIG.sidechain.erc20Contract);
            const abiFile = JSON.parse(fs.readFileSync(erc20AbiPath, "utf-8"));
            this.erc20Abi = abiFile["abi"] as AbiItem[];
        } catch (e) {
            console.error(e);
        }
    }

    public async initializeContract(): Promise<SidechainContract> {
        const checkStargate = await this.getStargateAddress();
        if (checkStargate instanceof Error) throw checkStargate;
        return this;
    }

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

    public getWrappingFee = async (): Promise<string> => {
        try {
            const wrappingFee = await this.bridgeContract.methods.WRAPPING_FEE().call();
            return fromWei(wrappingFee, "microether");
        } catch (e) {
            const error = e as Error;
            console.error(`Wrapping fee was not retrieved properly. Details: ${error.message}`);
            return "100000";
        }
    };

    public getUnwrappingFee = async (): Promise<string> => {
        try {
            const unwrappingFee = await this.bridgeContract.methods.UNWRAPPING_FEE().call();
            return fromWei(unwrappingFee, "Gwei");
        } catch (e) {
            const error = e as Error;
            console.error(`Unwrapping fee was not retrieved properly. Details: ${error.message}`);
            return "1000000000";
        }
    };

    public getAssetIds = async (): Promise<string[] | Error> => {
        const assetIds = await this.bridgeContract.methods.getAssetIds().call();
        return assetIds;
    };

    public getTokenRegistryAllowedList = async (): Promise<TokensRegistry | Error> => {
        // no filtering for now
        const assets = await this.getAssetIds();
        if (assets instanceof Error) return assets;

        let assetsDetails: MilkomedaStargateAsset[] = [];
        let adaMinValue = "2000000"; // TODO: do we want to assume any default value for ada?
        for (let id of assets) {
            try {
                const details = await this.bridgeContract.methods.tokenRegistry(id).call();
                if (details instanceof Error) return details;
                console.log(`Fetching details for ${details.tokenContract}`);

                if (id === WMAIN_ID) {
                    // conversion to Lovelaces should appear only for WADA
                    adaMinValue = fromWei(details.minimumValue, "microether"); // gives back microether = lovelace (for main asset),
                } else {
                    // if not WADA
                    const erc20Contract = new this.web3.eth.Contract(this.erc20Abi, details.tokenContract);

                    // we need to ask the following information from ERC20 contracts
                    const sidechainDecimals = await erc20Contract.methods.decimals().call();
                    const tokenName = await erc20Contract.methods.symbol().call();
                    assetsDetails.push({
                        idCardano: stripHexPrefix(id), // if 0x is there, then remove it
                        idMilkomeda: stripHexPrefix(details.tokenContract), // if 0x is there, then remove it
                        cardanoFingerprint: convertToAssetId(id),
                        minCNTInt: fromWei(details.minimumValue),
                        minGWei: fromWei(details.minimumValue, "Gwei"),
                        milkomedaDecimals: parseInt(sidechainDecimals, 10),
                        tokenSymbol: tokenName as string,
                    });
                }
            } catch (e) {
                console.error(e);
            }
        }

        const fromADAFeeLovelace = await contract.getWrappingFee();
        const toADAFeeGWei = await contract.getUnwrappingFee();

        const tokenRegistry: TokensRegistry = {
            minLovelace: adaMinValue ?? "2000000",
            assets: assetsDetails,
            wrappingFee: fromADAFeeLovelace,
            unwrappingFee: toADAFeeGWei,
        };

        return tokenRegistry;
    };
}

export const contract = new SidechainContract();
