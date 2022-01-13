import http from "http";
import express from "express";
import { Request, Response } from "express";

// eslint-disable-next-line
const semverCompare = require("semver-compare");

import { applyMiddleware, applyRoutes, Route } from "./utils";
import * as middleware from "./middleware";
import { contract } from "./contract";

// populated by ConfigWebpackPlugin
declare const CONFIG: ConfigType;

/**
 * HTTP API interface
 */

const router = express();

const middlewares = [middleware.handleCors
  , middleware.handleBodyRequestParsing 
  , middleware.handleCompression
];

applyMiddleware(middlewares, router);

const fullAddressList = async (req: Request, res: Response): Promise<void> => {
  const allowList = await contract.getAccountsList();
  if (allowList instanceof Error) {
    res.status(400).send({ error: allowList });
    return;
  }
  res.status(200).send({ allowList });
};

const isAddressAllowed = async (req: Request, res: Response) => {
  // TODO: Update config so node parses this env variable as a Boolean
  if (CONFIG.APIGenerated.enforceWhitelist === "TRUE") {
    if (req.query.address == null || req.query.address.length == 0) {
      res.send({"error": "Address not found. Please make sure that an address (string) is part of the request."});
      return;
    }
    const validAddresses = await contract.getAccountsList();
    if (validAddresses instanceof Error) {
      res.status(400).send({ error: `Couldn't get list of addresses to compare. ${validAddresses.message}`})
      return
    }
    const address: string = req.query.address as string;
    const isAllowed = validAddresses.indexOf(address) > -1;
    res.send({
      isAllowed
    });
  } else {
    res.send({ isAllowed: true });
  }
}

const stargate = async (req: Request, res: Response) => {
  // TODO: Update config so node parses this env variable as a Boolean
  if (CONFIG.APIGenerated.mainnet === "TRUE") {
      res.send({
        // TODO: dynamic Milkomeda address from server
        current_address: 'mainnet_address_here', // TODO: no mainnet address for now
        ttl_expiry: Number.MAX_SAFE_INTEGER / 2,
        assets: [],
      });
      return;
  } else {
    res.send({
      // TODO: dynamic Milkomeda address from server
      current_address: 'addr_test1wz6lvjg3anml96vl22mls5vae3x2cgaqwy2ewp5gj3fcxdcw652wz',
      ttl_expiry: Number.MAX_SAFE_INTEGER / 2,
      assets: [],
    });
  }
}

const routes: Route[] = [{ 
    path: "/v1/isAddressAllowed",
    method: "get",
    handler: isAddressAllowed 
  }, {
    path: "/v1/fullAllowedList",
    method: "get",
    handler: fullAddressList
  }, {
    path: "/v1/stargate",
    method: "get",
    handler: stargate
  },
];

applyRoutes(routes, router);
router.use(middleware.logErrors);
router.use(middleware.errorHandler);

const server = http.createServer(router);
const port: number = CONFIG.APIGenerated.port;

console.log("mainnet: ", CONFIG.APIGenerated.mainnet);
console.log("isAllowedList enforced: ", CONFIG.APIGenerated.enforceWhitelist);

contract.initializeContract()
.then(_ => {
  server.listen(port, () =>
    console.log(`listening on ${port}...`)
  );
  console.log("Contract connection initialized")
})
.catch(e => console.error(`There was problem with connecting to the sidechain contract.${e}`));
