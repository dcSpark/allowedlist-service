import type { Router, Request, Response, NextFunction } from "express";
import fs from "fs";
import { parse } from "csv-parse";
import path from "path";
import { isAddress, stripHexPrefix, isHexStrict } from "web3-utils";
import AssetFingerprint from "@emurgo/cip14-js";
import CONFIG from "../../config/default";

export const contentTypeHeaders = { headers: { "Content-Type": "application/json" } };

export const errMsgs = { noValue: "no value" };

const ASSET_INITIAL_BYTES = 40;

type Wrapper = (router: Router) => void;

export const applyMiddleware = (middlewareWrappers: Wrapper[], router: Router): void => {
    for (const wrapper of middlewareWrappers) {
        wrapper(router);
    }
};

export const HEX_REGEXP = RegExp("^[0-9a-fA-F]+$");
export const WMAIN_ID = "0x0000000000000000000000000000000000000000000000000000000000000000";

export interface Dictionary<T> {
    [key: string]: T;
}

type Handler = (req: Request, res: Response, next: NextFunction) => Promise<void> | void;

export interface Route {
    path: string;
    method: string;
    handler: Handler | Handler[];
}

export const applyRoutes = (routes: Route[], router: Router): void => {
    for (const route of routes) {
        const { method, path, handler } = route;
        // uncomment this line if you want to test locally
        // (router as any)[method](`/api${path}`, handler);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (router as any)[method](path, handler);
    }
};

export function assertNever(x: never): never {
    throw new Error("this should never happen" + x);
}

export type Nullable<T> = T | null;

export const loadAddressesFromCSV = (): Promise<Set<string>> => {
    return new Promise((resolve, _reject) => {
        const dataFromCSV: Set<string> = new Set();
        fs.createReadStream(path.resolve(__dirname, CONFIG.API.allowedAddressesCSV))
            .pipe(parse({ delimiter: "," }))
            .on("data", (csvrow: Array<string>) => {
                if (isAddress(csvrow[0])) {
                    dataFromCSV.add(csvrow[0]);
                }
            })
            .on("end", () => {
                console.log(`Found ${dataFromCSV.size} addresses in ${CONFIG.API.allowedAddressesCSV}.`);
                resolve(dataFromCSV);
            });
    });
};

/// Helper function, to filter out all non-evm addresses
export const filterAddresses = (): Promise<string[]> => {
    return new Promise((resolve, _reject) => {
        const dataFromCSV: string[] = [];
        fs.createReadStream(path.resolve(__dirname, "./files/r.csv")) // files/name_of_file_to_filter.csv
            .pipe(parse({ delimiter: "," }))
            .on("data", (csvrow: Array<string>) => {
                if (isAddress(csvrow[0])) {
                    dataFromCSV.push(csvrow[0]);
                }
            })
            .on("end", () => {
                const file = fs.createWriteStream(path.resolve(__dirname, "./files/r_new.txt"), "utf-8");
                dataFromCSV.forEach((v: string) => {
                    // console.log(v);
                    file.write(v + ",\n", "utf-8");
                });
                file.end();
                resolve(dataFromCSV);
            });
    });
};

export const convertToAssetId = (milkomedaAssetId: string): string => {
    try {
        if (milkomedaAssetId === WMAIN_ID) return "";

        const assetId = isHexStrict(milkomedaAssetId) ? stripHexPrefix(milkomedaAssetId) : milkomedaAssetId;
        // For Cardano we could just return the fingerprint, but some of the tokens doesn't have it on devnet indexer db,
        // so we use CIP14 to create an asset it
        const fingerprint = AssetFingerprint.fromHash(Buffer.from(assetId.substring(0, ASSET_INITIAL_BYTES), "hex")).fingerprint();

        return fingerprint;
    } catch (e) {
        const err = e as Error;
        console.error(err.message);

        return "";
    }
};

export const extractAlgorandAssetId = (assetId: string): string => {
    const a1Prefix = "a5537";
    const removedPrefix = assetId.replace(a1Prefix, "");
    const removedZeros = removedPrefix.replace(/^0+/, "");
    return removedZeros ?? assetId;
  }