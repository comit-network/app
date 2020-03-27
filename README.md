# COMIT BTC-DAI Swap App

## Install

First, clone the repo via git:

```bash
git clone git@github.com:comit-network/app.git
```

## Project Structure

The project contains both a Maker backend and a Taker desktop app.

```
docs/
|- app/
|- maker/
|- README.md
```

## Getting Started

Install dependencies for both Maker and Taker with `yarn`.

```bash
$ cd app
$ yarn
```

```bash
$ cd maker
$ yarn
```

## Running Maker Locally

```bash
$ cd maker
$ yarn dev
```

For ease of testing, the maker poller is run separately:

```bash
$ cd maker
$ yarn poll
```

Both components can be run concurrently:

```bash
$ cd maker
$ yarn dev:all
```

## Running Taker App Locally

```bash
$ yarn dev
```

You can run both Maker (+poller) and Taker concurrently:

```bash
$ yarn dev:all
```

## Packaging for Production

To package apps for the local platform:

```bash
$ yarn package
```

Then, open the `release/` directory.

## Docs

See [docs and guides here](https://electron-react-boilerplate.js.org/docs/installation)
