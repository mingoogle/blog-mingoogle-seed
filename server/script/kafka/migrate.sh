#!/bin/bash

GIT_ROOT_PATH=`git rev-parse --show-toplevel`
RUN_PATH=${GIT_ROOT_PATH}/server/script/kafka
NODE_PATH=${GIT_ROOT_PATH}/server

# node_modules install
cd ${NODE_PATH}; yarn install;
cd ${RUN_PATH};

DEFAULT_STATE_FILE=".migrate"
ENV_STATE_EXT=".local"
ARGUMENT_COUNT=$#
ENV=$1
COMMAND=$2
MIGRATION_FILE=$3

if [ "${ARGUMENT_COUNT}" -eq 0 ]; then
  echo "./migrate.sh [local/development/staging/production] [up/down/list] [migration file]"
  exit 1
fi

if [ "${ENV}" = "production" ]; then
  ENV_STATE_EXT=".prod"
elif [ "${ENV}" = "staging" ]; then
  ENV_STATE_EXT=".staging"
elif [ "${ENV}" = "development" ]; then
  ENV_STATE_EXT=".dev"
elif [ "${ENV}" = "local" ]; then
  ENV_STATE_EXT=".local"
else
  echo "./migrate.sh [local/development/staging/production] [up/down/list] [migration file]"
  exit 1
fi

if [ "${COMMAND}" != "down" -a "${COMMAND}" != "up" -a "${COMMAND}" != "list" ]; then
  echo "./migrate.sh [local/development/staging/production] [up/down/list] [migration file]"
  exit 1
fi

if [ "${COMMAND}" = "down" ]; then
  if [ "${MIGRATION_FILE}" = "" ]; then
    MIGRATION_FILE="latest-file"
  fi
fi

echo "../../node_modules/.bin/migrate ${COMMAND} ${MIGRATION_FILE} -f ${DEFAULT_STATE_FILE}${ENV_STATE_EXT} --env .env${ENV_STATE_EXT}"

../../node_modules/.bin/migrate ${COMMAND} ${MIGRATION_FILE} -f ${DEFAULT_STATE_FILE}${ENV_STATE_EXT} --env ".env"${ENV_STATE_EXT} --compiler="ts:./typescript-compiler.js"
