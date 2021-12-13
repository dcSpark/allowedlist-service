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
  if (req.query.address == null || req.query.address.length == 0) {
    res.send({"error": "Address not found. Please make sure that an address (string) is part of the request."});
    return;
  }

  const address: string = req.query.address as string;
  const isAllowed = allowedList.indexOf(address) > -1;
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

console.log("isAllowedList: ", allowedList);

server.listen(port, () =>
  console.log(`listening on ${port}...`)
);
