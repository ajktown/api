FROM node:20

COPY . .

RUN yarn

RUN yarn build

# TODO: Should dynamically set the port from the env file
EXPOSE 3000
ENTRYPOINT [ "yarn", "start" ]