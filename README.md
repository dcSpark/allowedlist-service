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
npm run dev
```

*Never put production credentials into repository!*

## Containers
This will build to a container with the docker file.  The container is using the PM2 runtime.  You will need to pass ENV variables to the container to register with PM2 logging.


## Tests


## API
