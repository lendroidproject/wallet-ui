# wallet-ui

Source code of the Wallet UI which uses Lendroid's v2 Protocol

This proect is powered by [Next.js](https://github.com/zeit/next.js/).

## Prerequisites

You will need [Node.js](https://nodejs.org) version 8.0 or greater installed on your system.

## How to install?

```shell
npm install
```

## Setup `environment`

```shell
cp .env.example .env
```

## Available `scripts`

```shell
npm run dev // development mode

npm run prod // production mode

npm run build // production build

npm run start // serve build
```

## How to develop?

```shell
npm run dev // http://localhost:3000
```

## Work with `library` (development or production)?

### 1. development

```json
{
  "dependencies": {
    "lendroid-projct": "../lendroid-2-js"
  }
}
```

### 2. production

```json
{
  "dependencies": {
    "lendroid-projct": "<stable-version>"
  }
}
```

## How to work with `lendroid-project`

```shell
git clone https://github.com/lendroidproject/lendroid-2-js.git
npm install
npm run build
cp -rf ./dist ../wallet-ui/node_modules/lendroid-project
```
