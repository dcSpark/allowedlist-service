import http from "http";
import express from "express";
import { Request, Response } from "express";

// eslint-disable-next-line
const semverCompare = require("semver-compare");

import { applyMiddleware, applyRoutes, Route } from "./utils";
import * as middleware from "./middleware";
import { contract, TokensRegistry } from "./contract";
import { CacheKeys, CacheOption } from "./cache";
import { cacheManager } from "./cache";

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
        method: contract.getAccountsList,
    },
];

// for each endpoint that requires retrieving information from sidechain all data should be added to cache
// then same data should be retrieved when the client calls the api - this way we limit number of connections and only the service can query the sidechain
const fullAddressList = async (req: Request, res: Response): Promise<void> => {
    try {
        const allowList = (await cacheManager.get(CacheKeys.FULL_ALLOWED_LIST)) as string;
        res.status(200).send({ allowList });
    } catch (e) {
        const err = e as Error;
        console.log(`${err.name}, ${err.message}, ${err.stack}`);
        res.status(400).send({ error: `Couldn't fetch information about allowed list. ${err.message}` });
        return;
    }
};

const isAddressAllowed = async (req: Request, res: Response) => {
    // TODO: Update config so node parses this env variable as a Boolean
    if (CONFIG.API.enforceWhitelist === "TRUE") {
        if (req.query.address == null || req.query.address.length == 0) {
            res.send({
                error: "Address not found. Please make sure that an address (string) is part of the request.",
            });
            return;
        }
        try {
            const validAddresses = (await cacheManager.get(CacheKeys.FULL_ALLOWED_LIST)) as string[];
            const address: string = req.query.address as string;
            const isAllowed = validAddresses.indexOf(address) > -1;
            res.send({
                isAllowed,
            });
            return;
        } catch (e) {
            const err = e as Error;
            console.log(`${err.name}, ${err.message}, ${err.stack}`);
            res.status(400).send({ error: `Couldn't check validity of the address. ${err.message}` });
            return;
        }
    } else {
        res.send({ isAllowed: true });
    }
};

const stargate = async (req: Request, res: Response) => {
    try {
        const stargateAddress = await cacheManager.get(CacheKeys.STARGATE);

        if (!stargate) {
            res.status(400).send({ error: `Stargate address saved in cache is ${stargate}.` });
            return;
        }

        const tokenRegistry = (await cacheManager.get(CacheKeys.TOKEN_REGISTRY)) as TokensRegistry | Error;
        if (tokenRegistry instanceof Error) {
            res.status(400).send({ error: `TokenRegistry saved in cache is ${tokenRegistry.message}.` });
            return;
        }

        let registry = tokenRegistry as TokensRegistry;
        res.send({
            current_address: stargateAddress,
            ttl_expiry: new Date().setHours(24, 0, 0, 0),
            ada: {
                minLovelace: registry.minLovelace,
                fromADAFeeLovelace: "500000",
                toADAFeeGWei: "500000",
            },
            assets: registry.assets,
        });
        return;
    } catch (e) {
        const err = e as Error;
        console.log(`${err.name}, ${err.message}, ${err.stack}`);
        res.status(400).send({ error: `Couldn't get information about sidechain contract. ${err.message}` });
        return;
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
console.log("isAllowedList enforced: ", CONFIG.API.enforceWhitelist);

contract
    .initializeContract()
    .then(() => console.log("Contract connection initialized"))
    .catch((e) => console.error(`There was problem with connecting to the sidechain contract.${e}`))
    .finally(() => {
        // always start REST API
        server.listen(port, () => console.log(`listening on ${port}...`));

        cacheManager
            .keepCached(injectForCaching, CONFIG.API.cacheIntervalMs)
            .then((_) => console.log("Cache updater initialized"))
            .catch((e: unknown) => console.error(e));
    });
