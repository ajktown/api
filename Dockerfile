FROM node:18

COPY . .

RUN yarn

RUN yarn build

EXPOSE 3000
ENTRYPOINT [ "yarn", "start" ]