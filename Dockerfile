FROM node:16.19.0-alpine AS x-builder
RUN apk add --no-cache git
ARG APP=/app
#
WORKDIR ${APP}/server
COPY server/package*.json ./
COPY server/tsconfig*.json ./
RUN npm install
#RUN npm ci --package-lock --ignore-scripts
#
WORKDIR ${APP}/shared
COPY shared ./
#
WORKDIR ${APP}/server
COPY server/config ./config
COPY server/contract ./contract
COPY server/src ./src
COPY server/types ./types
COPY server/webpack.*.ts ./
COPY server/files ./files
ENV NODE_ENV=production
RUN npm run build --ignore-scripts \
     && npm install
#    && npm ci --omit=dev --ignore-scripts

###############################################

FROM node:16.19.0-alpine as allowedlist-service
RUN npm install pm2 -g
#
ARG APP=/app
WORKDIR ${APP}
COPY --from=x-builder ${APP}/server/build ./build
COPY --from=x-builder ${APP}/server/node_modules ./node_modules
COPY server/pm2.yaml ${APP}/
#
EXPOSE 3000
CMD ["pm2-runtime", "--json", "pm2.yaml"]
