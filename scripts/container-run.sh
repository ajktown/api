#!/bin/bash
#
# Runs a local container with the latest image.
# ! Do not contain any information
# ! Depends on .env file that has no double quotation marks
# TODO: Only works when the .env ENV is prod, as it fails to connect to local mdb container.

# Variables ##########################
CONTAINER_EXPOSING_PORT=5700         #
APP_PORT=7000                        #
CONTAINER_NAME=ajktown-api-container #
APP_IMAGE=ajktown-api:latest         #
######################################

# Build image with tag latest
docker build -t $APP_IMAGE .

# Remove container, if any.
docker rm -f $CONTAINER_NAME

# Run a container with env
docker run -d -p $CONTAINER_EXPOSING_PORT:$APP_PORT \
  --name $CONTAINER_NAME \
  --env-file .env \
  $APP_IMAGE # always put the image at the end.
