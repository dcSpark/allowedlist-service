import { Router, Request, Response, NextFunction } from "express";

declare const CONFIG: ConfigType;

export const contentTypeHeaders = { headers: { "Content-Type": "application/json" } };

export const errMsgs = { noValue: "no value" };

type Wrapper = (router: Router) => void;

export const applyMiddleware = (middlewareWrappers: Wrapper[], router: Router) => {
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
export const delay = (ms: number) =>
    new Promise((resolve) => {
        setTimeout(resolve, ms);
    });

// any on purpose, cause it can be any payload or Error
export const requestWrapper = async (func: Function): Promise<any> => {
    let retryNumber = 0;
    let result!: any;
    while (retryNumber < CONFIG.API.requestRetries) {
        try {
            result = await func();
            if (!result) throw result;
            return result;
        } catch (e) {
            console.error(e);
            const err = e as Error;
            retryNumber++;
            console.log(`Retry ${retryNumber}/${CONFIG.API.requestRetries}`);
            result = new Error(`Probilem with executing: ${func}\n${err.name},${err.message},${err.stack}`);
            await delay(5000); // retry in 5s
        }
    }

    return result;
};
