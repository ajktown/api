FROM node:18

COPY . .

RUN yarn

RUN yarn build

# TODO: Should dynamically set the port from the env file
EXPOSE 8000
ENTRYPOINT [ "yarn", "start" ]