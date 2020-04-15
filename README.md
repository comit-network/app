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

$ cd ..
$ yarn dev
```

You need to run `yarn` for the taker twice because of Electron's [two package structure](https://www.electron.build/tutorials/two-package-structure).

# Maker

```bash
$ cd maker
$ yarn
$ yarn dev
```

For ease of debugging, the maker poller is run separately:

```bash
$ cd maker
$ yarn poll
```

## Packaging for Production

To package apps for the local platform:

```bash
$ yarn package
```

Then, open the `release/` directory.

## Docs

See [docs and guides here](https://electron-react-boilerplate.js.org/docs/installation)

## Troubleshooting

### Missing '.env' when running Taker app

Make sure that an `.env` and `.env.application` exists in the root directory.

See `.env.sample` and `.env.application.sample` for a sample template.
