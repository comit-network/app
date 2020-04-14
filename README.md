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

Install dependencies for both Taker with `yarn`.

## Taker

```bash
$ yarn # Run in the root project directory

$ cd app
$ yarn
$ yarn comit:import-env
```

You need to run `yarn` for the taker twice because of Electron's [two package structure](https://www.electron.build/tutorials/two-package-structure).

# Maker

```bash
$ cd maker
$ yarn
$ yarn comit:import-env
```

> Note: both maker and taker uses its own project-specific `.env` file for modularity and ease of deployment. Whenever you restart `comit-scripts` with `yarn start-env`, ensure that you rerun `yarn comit:env` for both `app` and `maker`.

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
