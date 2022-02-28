import type { Router, Request, Response, NextFunction } from "express";

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
