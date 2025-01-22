FROM node:20
# Does this match to the following as well?: .github/workflows/docker-image.yaml of "node-version"

COPY . .

RUN yarn

RUN yarn build

# TODO: Should dynamically set the port from the env file
EXPOSE 3000
ENTRYPOINT [ "yarn", "start" ]