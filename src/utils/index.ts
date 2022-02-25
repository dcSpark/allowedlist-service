import type { Router, Request, Response, NextFunction } from "express";

declare const CONFIG: ConfigType;

export const contentTypeHeaders = { headers: { "Content-Type": "application/json" } };

export const errMsgs = { noValue: "no value" };

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

export const delay = (ms: number): Promise<unknown> =>
    new Promise((resolve) => {
        setTimeout(resolve, ms);
    });

// any on purpose, cause it can be any payload or Error
export const requestWrapper = async (func: () => unknown): Promise<unknown> => {
    let retryNumber = 0;
    let result!: unknown;
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
            result = new Error(`Error while requesting the function: ${err.message}`);
            await delay(CONFIG.API.requestRetriesMs); // retry in 5s
        }
    }

    return result;
};
