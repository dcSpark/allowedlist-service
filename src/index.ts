import http from "http";
import express from "express";
import { Request, Response } from "express";

// eslint-disable-next-line
const semverCompare = require("semver-compare");

import { applyMiddleware, applyRoutes, Route } from "./utils";
import * as middleware from "./middleware";
import { default as allowedList } from "./allowedList"

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

const fullAddressList = async (req: Request, res: Response) => {
  res.send({
    allowedList
  })
}

const isAddressAllowed = async (req: Request, res: Response) => {
  // TODO: Update config so node parses this env variable as a Boolean
  if (CONFIG.APIGenerated.enforceWhitelist === "TRUE") {
    if (req.query.address == null || req.query.address.length == 0) {
      res.send({"error": "Address not found. Please make sure that an address (string) is part of the request."});
      return;
    }
  
    const address: string = req.query.address as string;
    const isAllowed = allowedList.indexOf(address) > -1;
    res.send({
      isAllowed
    });
  } else {
    res.send({ isAllowed: true });
  }
}

const stargate = async (req: Request, res: Response) => {
  // TODO: Update config so node parses this env variable as a Boolean
  if (CONFIG.APIGenerated.enforceWhitelist === "TRUE") {
      res.send({
        // TODO: dynamic Milkomeda address from server
        current_address: 'addr_test1wz6lvjg3anml96vl22mls5vae3x2cgaqwy2ewp5gj3fcxdcw652wz',
        ttl_expiry: Number.MAX_SAFE_INTEGER / 2,
        assets: [],
      });
      return;
  } else {
    res.send({
      // TODO: dynamic Milkomeda address from server
      current_address: 'mainnet_address_here', // TODO: no mainnet address for now
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

console.log("isAllowedList enforced: ", CONFIG.APIGenerated.enforceWhitelist);

server.listen(port, () =>
  console.log(`listening on ${port}...`)
);
