import http from "http";
import express from "express";
import type { Request, Response } from "express";

import type { Route } from "./utils";
import { applyMiddleware, applyRoutes, loadAddressesFromCSV } from "./utils";
import * as middleware from "./middleware";
import type { TokensRegistry } from "./contract";
import { contract } from "./contract";
import type { CacheOption } from "./cache";
import { CacheKeys, cacheManager } from "./cache";
import type { MilkomedaStargateResponse } from "../../shared/types";

// eslint-disable-next-line
const semverCompare = require("semver-compare");

// populated by ConfigWebpackPlugin
declare const CONFIG: ConfigType;

/**
 * HTTP API interface
 */

const router = express();
const middlewares = [middleware.handleCors, middleware.handleBodyRequestParsing, middleware.handleCompression];
applyMiddleware(middlewares, router);

// list of data which should be cached and updated on the given time interval
const injectForCaching: CacheOption[] = [
    {
        key: CacheKeys.STARGATE,
        method: contract.getStargateAddress,
    },
    {
        key: CacheKeys.TOKEN_REGISTRY,
        method: contract.getTokenRegistryAllowedList,
    },
    {
        key: CacheKeys.FULL_ALLOWED_LIST,
        method: loadAddressesFromCSV,
    },
];

// for each endpoint that requires retrieving information from sidechain all data should be added to cache
// then same data should be retrieved when the client calls the api - this way we limit number of connections and only the service can query the sidechain
const fullAddressList = async (req: Request, res: Response): Promise<void> => {
    try {
        const allowList = (await cacheManager.get(CacheKeys.FULL_ALLOWED_LIST)) as Set<string>;
        res.status(200).send({ allowList: [...allowList.keys()] });
    } catch (e) {
        const err = e as Error;
        console.log(`${err.name}, ${err.message}, ${err.stack}`);
        res.status(400).send({ error: `Couldn't fetch information about allowed list. ${err.message}` });
    }
};

const isAddressAllowed = async (req: Request, res: Response) => {
    // TODO: remove the whole endpoint once frontend apps are adjusted.
    // for now leaving the basic return just to make apps compatible, but open the gates for everyone
    res.send({ isAllowed: true });
};

const stargate = async (req: Request, res: Response) => {
    try {
        const stargateAddress = (await cacheManager.get(CacheKeys.STARGATE)) as string;
        const tokenRegistry = (await cacheManager.get(CacheKeys.TOKEN_REGISTRY)) as TokensRegistry;

        const response: MilkomedaStargateResponse = {
            current_address: stargateAddress,
            ttl_expiry: new Date().setHours(24, 0, 0, 0),
            ada: {
                minLovelace: tokenRegistry.minLovelace,
                fromADAFeeLovelace: tokenRegistry.wrappingFee,
                toADAFeeGWei: tokenRegistry.unwrappingFee,
            },
            assets: tokenRegistry.assets,
        };
        res.send(response);
        return;
    } catch (e) {
        const err = e as Error;
        console.log(`${err.name}, ${err.message}, ${err.stack}`);
        res.status(400).send({ error: `Couldn't get information about sidechain contract. ${err.message}` });
    }
};

const routes: Route[] = [
    {
        path: "/v1/isAddressAllowed",
        method: "get",
        handler: isAddressAllowed,
    },
    {
        path: "/v1/fullAllowedList",
        method: "get",
        handler: fullAddressList,
    },
    {
        path: "/v1/stargate",
        method: "get",
        handler: stargate,
    },
];

applyRoutes(routes, router);
router.use(middleware.logErrors);
router.use(middleware.errorHandler);

const server = http.createServer(router);
const port: number | string = process.env.PORT || CONFIG.API.port;

console.log("mainnet: ", CONFIG.API.mainnet);

contract
    .initializeContract()
    .then(() => console.log("Contract connection initialized."))
    .catch((e) => console.error(`There was problem with connecting to the sidechain contract.${e}`))
    .finally(() => {
        // always start REST API
        server.listen(port, () => console.log(`listening on ${port}...`));

        cacheManager
            .keepCached(injectForCaching, CONFIG.API.cacheIntervalMs)
            .then((_) => console.log("Cache updater initialized"))
            .catch((e: unknown) => console.error(e));
    });
