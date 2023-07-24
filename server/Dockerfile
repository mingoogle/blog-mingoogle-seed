# build stage
FROM node:18.14.1 as build-stage

ARG SERVER_NAME
ENV SERVER_NAME $SERVER_NAME

#module layer
WORKDIR /server
ADD package.json /server/package.json
ADD tsconfig.json /server/tsconfig.json
ADD tsconfig.build.json /server/tsconfig.build.json
ADD nest-cli.json /server/nest-cli.json
ADD yarn.lock /server/yarn.lock
RUN cd /server && yarn

#build layer
COPY ./libs /server/libs
RUN yarn build libs
COPY ./apps/$SERVER_NAME /server/apps/$SERVER_NAME
RUN yarn build $SERVER_NAME


# prodcution stage
FROM node:18.14.1

ARG SERVER_NAME
ENV SERVER_NAME $SERVER_NAME

WORKDIR /server

COPY --from=build-stage /server/node_modules ./node_modules
COPY --from=build-stage /server/dist ./dist
COPY .env .

ENTRYPOINT ["/bin/bash", "-c", "node ./dist/apps/$SERVER_NAME/main.js"]
