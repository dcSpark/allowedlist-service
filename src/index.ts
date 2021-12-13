import http from "http";
import express from "express";
import { Request, Response } from "express";

// eslint-disable-next-line
const semverCompare = require("semver-compare");

import { applyMiddleware, applyRoutes, Route } from "./utils";
import * as middleware from "./middleware";

// populated by ConfigWebpackPlugin
declare const CONFIG: ConfigType;
declare const ALLOWEDLIST: string[];

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
    allowedList: ALLOWEDLIST
  })
}

const isAddressAllowed = async (req: Request, res: Response) => {
  if (req.body.address == null || req.body.address.length == 0) {
    res.send({"error": "Address not found. Please make sure that an address (string) is part of the request."});
    return;
  }

  const isAllowed = ALLOWEDLIST.indexOf("") > -1;

  res.send({
    isAllowed
  });
  return;
}

const routes: Route[] = [{ 
    path: "/v1/isAddressAllowed",
    method: "get",
    handler: isAddressAllowed 
  }, {
    path: "/v1/fullAllowedList",
    method: "get",
    handler: fullAddressList
  },
];

applyRoutes(routes, router);
router.use(middleware.logErrors);
router.use(middleware.errorHandler);

const server = http.createServer(router);
const port: number = CONFIG.APIGenerated.port;

server.listen(port, () =>
  console.log(`listening on ${port}...`)
);

console.log("Starting interval");
