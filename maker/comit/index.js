const _ = require('lodash');
const {
  Actor,
  BigNumber,
  createActor,
  EthereumWallet,
  InMemoryBitcoinWallet,
  SwapRequest,
} = require("comit-sdk");
const fs = require("fs");
const os = require("os");
const path = require("path");
const MakerStateMachine = require('./stateMachine');

async function fetchPropertiesOfList(swaps) {
  const properties = await Promise.all(_.map(swaps, s => fetchProperties(s)));
  return properties;
}

async function fetchProperties(swap) {
  const { properties } = await swap.fetchDetails();
  return { url: swap.self, ...properties}
}

async function getSwaps() {
  const maker = await getMaker();
  const newSwaps = await maker.comitClient.getNewSwaps();
  const newSwapsProperties = await fetchPropertiesOfList(newSwaps);

  const ongoingSwaps = await maker.comitClient.getOngoingSwaps();
  const ongoingSwapsProperties = await fetchPropertiesOfList(ongoingSwaps);

  const doneSwaps = await maker.comitClient.getDoneSwaps();
  const doneSwapsProperties = await await fetchPropertiesOfList(doneSwaps);

  return [...newSwapsProperties, ...ongoingSwapsProperties, ...doneSwapsProperties];
}

async function getPendingSwaps() { // Ignores Done
  const maker = await getMaker();
  const newSwaps = await maker.comitClient.getNewSwaps();
  const ongoingSwaps = await maker.comitClient.getOngoingSwaps();

  return [...newSwaps, ...ongoingSwaps];
}

async function findSwapById(swapId) {
  const maker = await getMaker();
  const s = await maker.comitClient.retrieveSwapById(swapId);
  const properties = await fetchProperties(s);
  return properties;
}

async function getMaker() {
  const maker = await getNode(0, 'Maker');
  return maker;
}

async function getNode(index, name) {
  const bitcoinWallet = await InMemoryBitcoinWallet.newInstance(
    "regtest",
    process.env.BITCOIN_P2P_URI,
    process.env[`BITCOIN_HD_KEY_${index}`]
  );
  await new Promise(resolve => setTimeout(resolve, 1000)); // TODO: why is this here

  const ethereumWallet = new EthereumWallet(
      process.env.ETHEREUM_NODE_HTTP_URL,
      process.env[`ETHEREUM_KEY_${index}`]
  );

  return createActor(
      bitcoinWallet,
      ethereumWallet,
      process.env[`HTTP_URL_CND_${index}`],
      name
  );
}

module.exports = {
  getNode,
  getMaker,
  getSwaps,
  getPendingSwaps,
  findSwapById,
  MakerStateMachine
}
