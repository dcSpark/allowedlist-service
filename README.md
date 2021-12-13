# AllowedList Service
[![Node.js CI](https://github.com/dcSpark/pricing-service/actions/workflows/node.js.yml/badge.svg?branch=main)](https://github.com/dcSpark/pricing-service/actions/workflows/node.js.yml)




## Background


## Purpose of this project
The purpose of this micro service is to provide a list of addresses that are allowed to use the bridge in Milkomeda.

# Requirements
If you want to add an address you will have the edit the `allowedList.ts` file and restart the service.

## Building

Development build (with hot reloading):
```bash
# install the right version of Node
nvm use
nvm install

# install dependencies
npm install

# run the server
npm start
```

*Never put production credentials into any repository!*

I had to add 2 env variables to deploy it working on Heroku:

```bash
heroku config:set NPM_CONFIG_PRODUCTION=false -a allowedlist-service
heroku config:set USE_NPM_INSTALL=true -a allowedlist-service
```

## Containers
N/A for now
Do not try to use them!
