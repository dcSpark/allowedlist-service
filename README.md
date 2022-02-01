# AllowedList Service
[![Node.js CI](https://github.com/dcSpark/pricing-service/actions/workflows/node.js.yml/badge.svg?branch=main)](https://github.com/dcSpark/pricing-service/actions/workflows/node.js.yml)


## Background


## Purpose of this project
The purpose of this micro service is to provide a list of addresses that are allowed to use the bridge in Milkomeda.

## Building

Development build (with hot reloading):
```bash
# install the right version of Node
nvm use
nvm install

# install dependencies
npm install

# run the server
npm run start
```
*Never put production credentials into any repository!*

Feel free to test it using:
```sh
curl  http://localhost:3000/v1/isAddressAllowed?address=addr1qxm9k70p3j54qfgvvhx39rh0kfm6k4lxyfkavks0cm7kklxlmylqk3ksyqnhe8dadcee2a5syrc8a2salkpa3e0sp76symvshl
```
Should return `{"isAllowed":true}`

## Containers
This will build to a container with the docker file.  The container is using the PM2 runtime.  You will need to pass ENV variables to the container to register with PM2 logging.


## Tests
=======
I had to add 2 env variables to deploy it working on Heroku:

```bash
heroku config:set NPM_CONFIG_PRODUCTION=false -a allowedlist-service
heroku config:set USE_NPM_INSTALL=true -a allowedlist-service
```

## Containers
N/A for now
Do not try to use them!

# Deployments
The default configuration of `sidechain` section consists of values which should allow to connect to `mainnet` contract when deployed.
Values can be also set using `environmental` variables such as:
 * `CONTRACT_HOST` - url to Besu node e.g. `http://localhost:8545`
 * `ALLOW_LIST_CONTRACT_ADDRESS` - address of the allowlist contract deployed on the besu node in the sidechain
 * `BRIDGE_CONTRACT_CHAIN_ID` - bridge contract has different chainId depending on the environment. For `devnet` it's `200101` and for `mainnet` it's `2001`

# Contracts
Service uses 2 contracts living on the Besu node on the sidechain (`mainnet`).
1. `AllowedList Contract` - requires 2 files (inside `contracts/` directory):
   * `AccountIngress.json` - required to initialize account ingress contract & fetch necessary contract rules
   * `AccountRulesList.json`  - required to fetch specific functionalities like `getAccounts()`
  
2. `Bridge Contract` - requires 2 files (inside `contracts/` directory):
   * `Proxy.json` - introduces sidechain bridge contract key initialization features
   * `SidechainBridge.json` - introduces sidechain bridge contract functionalities

# Endpoints
<details>
    <summary>/v1/fullAllowedList</summary>
    Returns array of EVM addresses allowed in the mainnet (`http://localhost:3000/v1/fullAllowedList`).
```json
{
    "allowList": [
        "0x...",
        "0x...",
    ]
}
```
</details>

<details>
    <summary>/v1/fullAllowedList</summary>
    Returns information if given address is on allowed list or not.(`http://localhost:3000/v1/isAddressAllowed?address=0x0...`).
```json
{
    "isAllowed": true
}
```
</details>

<details>
    <summary>/v1/stargate</summary>
    Returns stargate address, tll_expiry and list of assets.
    (For now only stargate address is fetched from bridge contract)
```json
{
    "current_address": "addr1...",
    "ttl_expiry": 123,
    "assets": []
}
```
</details>

<details>
    <summary>/v1/assets</summary>
    Returns list of allowed assets.
```json
{
    "id": "asset fingerprint",
    "min": "123"
}
```
</details>