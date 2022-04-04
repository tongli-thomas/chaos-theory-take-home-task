# Chaos Theory Take Home Task (Thomas Li)

This take home task is developed using Node.js, Typescript and [NestJS](https://nestjs.com/). The BTC-USD data is retrieved from [Blockchain.com](api.blockchain.com).

## Prerequisites

- [Node.js](https://nodejs.org/en/)

## Installation

Use the package manager npm to install dependencies.

```bash
npm i
```

## Guide

Create a .env file to set environment variables, refer to .env.example.

To run it locally, use

```bash
npm run start
```

To run using docker (assuming SERVER_PORT set to 80), use
```bash
docker build -t test-server .
docker run --rm -p 80:80 --env-file .env test-server
```

## Usage

[API Doc](https://chaos-theory-take-home-task-thomasli.azurewebsites.net/api)

```bash
# returns btc-usd pair at given timestamp
# timestamp is in ISO(86) Date format, i.e., yyyy-mm-dd hh:MM:ss
curl -X GET "https://chaos-theory-take-home-task-thomasli.azurewebsites.net/api/exchange-rates/search?timestamp=2022-04-03T22:35:58"

# returns latest btc-usd pair
curl -X GET "https://chaos-theory-take-home-task-thomasli.azurewebsites.net/api/exchange-rates/latest"

# returns average price within a specified time period
# timestamp is in ISO(86) Date format, i.e., yyyy-mm-dd hh:MM:ss
curl -X GET "https://chaos-theory-take-home-task-thomasli.azurewebsites.net/api/exchange-rates/average?startTimestamp=2022-04-03T22:33:58&endTimstamp=2022-04-03T22:35:00"
```

## Public Endpoints
The endpoints are hosted on https://chaos-theory-take-home-task-thomasli.azurewebsites.net/api

## Unit Test

To run the unit tests, use
```bash
npm run test
```
