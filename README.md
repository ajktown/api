# AJK Town API

[!["Buy Me A Coffee"](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://www.buymeacoffee.com/mlajkim)


## Table of Contents

<!-- TOC -->

- [AJK Town API](#ajk-town-api)
  - [Table of Contents](#table-of-contents)
  - [Overview](#overview)
  - [For Developers](#for-developers)
  - [Public Image](#public-image)
    - [Push image command locally](#push-image-command-locally)
  - [For Envoy](#for-envoy)
  - [About the starter of this project](#about-the-starter-of-this-project)
    - [Description](#description)
    - [Installation](#installation)
    - [Running the app](#running-the-app)
    - [Test](#test)
    - [Support](#support)
    - [License](#license)

<!-- /TOC -->

## Overview

`AJK Town API` is the second generation project produced by AJK Town, or AJ Kim. It was renamed after "Wordy", which once contained both API server and the Frontend source code packaged together. They are now separated into two repositories `AJK Town API` and `AJK Town Wordnote`.

https://api.ajktown.com

## For Developers
- [Developer guide](https://github.com/ajktown/docs/tree/main/dev_api)

## Public Image

https://hub.docker.com/r/ajktown/api/tags

### Push image command locally
By default, the GitHub Action will build and push the image to the Docker Hub. If you want to push the image locally, you can use the following commands:
```sh

docker build -t ajktown/api:latest .
docker push ajktown/api:latest

```

## For Envoy

Please check the documentation [here](https://github.com/ajktown/docs/blob/main/prepare-envoy.md)

## About the starter of this project

This project is built on the starter code that [Nest JS](https://docs.nestjs.com/) provides.

```sh
project_name="ajktown-api" # you can insert your project name
git clone https://github.com/nestjs/typescript-starter.git "${project_name}"
```


<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest
  
  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

### Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

### Installation

```bash
$ yarn
```

### Running the app

```bash
# development
$ yarn start

# watch mode
$ yarn start:dev

# production mode
$ yarn start:prod
```

### Test

```bash
# unit tests
$ yarn test

# e2e tests
$ yarn test:e2e

# test coverage
$ yarn test:cov
```

### Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

### License

  Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
