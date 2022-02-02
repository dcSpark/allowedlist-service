import { Router, Request, Response, NextFunction } from "express";
import BN from "bn.js";
import { fromWei, isHexStrict, toBN } from "web3-utils";

export const contentTypeHeaders = { headers: { "Content-Type": "application/json" } };

export const errMsgs = { noValue: "no value" };

export const LOVELACES = 1000000;

type Wrapper = (router: Router) => void;

export const applyMiddleware = (middlewareWrappers: Wrapper[], router: Router) => {
    for (const wrapper of middlewareWrappers) {
        wrapper(router);
    }
};

export const HEX_REGEXP = RegExp("^[0-9a-fA-F]+$");

export interface Dictionary<T> {
    [key: string]: T;
}

type Handler = (req: Request, res: Response, next: NextFunction) => Promise<void> | void;

export interface Route {
    path: string;
    method: string;
    handler: Handler | Handler[];
}

export const applyRoutes = (routes: Route[], router: Router) => {
    for (const route of routes) {
        const { method, path, handler } = route;
        // uncomment this line if you want to test locally
        // (router as any)[method](`/api${path}`, handler);
        (router as any)[method](path, handler);
    }
};

export function assertNever(x: never): never {
    throw new Error("this should never happen" + x);
}

export type Nullable<T> = T | null;

export function scanInteger(x: any, strict = false): Nullable<number> {
    switch (typeof x) {
        case "number":
            return Number.isInteger(x) ? x : null;
        case "string":
            return /^[+-]?\d+$/.test(strict ? x : x.trim()) ? Number(x) : null;
        default:
            return null;
    }
}

export const toLovelaces = (value: string): string | Error => {
    try {
        return new BN(fromWei(value)).mul(new BN(LOVELACES)).toString();
    } catch (e) {
        const err = e as Error;
        console.log(err.message);
        return err;
    }
}

export const remove0x = (value: string) => isHexStrict(value) ? value.substring(2) : value;