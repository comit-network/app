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

async function parsePropertiesList(swaps) {
  const properties = await Promise.all(_.map(swaps, s => parseProperties(s)));
  return properties;
}

async function parseProperties(swap) {
  const { properties } = await swap.fetchDetails();
  return properties
}

async function getSwaps() {
  const maker = await getMaker();
  const newSwaps = await maker.comitClient.getNewSwaps();
  const newSwapsProperties = await parsePropertiesList(newSwaps);

  const ongoingSwaps = await maker.comitClient.getOngoingSwaps();
  const ongoingSwapsProperties = await parsePropertiesList(ongoingSwaps);

  const doneSwaps = await maker.comitClient.getDoneSwaps();
  const doneSwapsProperties = await await parsePropertiesList(doneSwaps);

  return [...newSwapsProperties, ...ongoingSwapsProperties, ...doneSwapsProperties];
}

async function getPendingSwaps() { // Ignores Done
  const maker = await getMaker();
  const newSwaps = await maker.comitClient.getNewSwaps();
  const newSwapsProperties = await parsePropertiesList(newSwaps);

  const ongoingSwaps = await maker.comitClient.getOngoingSwaps();
  const ongoingSwapsProperties = await parsePropertiesList(ongoingSwaps);

  return [...newSwapsProperties, ...ongoingSwapsProperties];
}

async function findSwapById(swapId) {
  const maker = await getMaker();
  const s = await maker.comitClient.retrieveSwapById(swapId);
  const properties = await parseProperties(s);
  return properties;
}

function parseMakerSwapStatus(swapProperties) {
  console.log('parseMakerSwapStatus');
  const { state } = swapProperties;

  const TAKER_SENT = (state.communication.status === 'SENT' && state.alpha_ledger.status === 'NOT_DEPLOYED' && state.beta_ledger.status === 'NOT_DEPLOYED');
  if (TAKER_SENT) {
    return 'TAKER_SENT';
  }

  const TAKER_LEDGER_FUNDED = (state.alpha_ledger.status === 'FUNDED' && state.beta_ledger.status === 'NOT_DEPLOYED');
  if (TAKER_LEDGER_FUNDED) {
    return 'TAKER_LEDGER_FUNDED';
  }

  const TAKER_LEDGER_REDEEMED = (state.alpha_ledger.status === 'REDEEMED' && state.beta_ledger.status === 'FUNDED');
  if (TAKER_LEDGER_REDEEMED) {
    return 'TAKER_LEDGER_REDEEMED';
  }

  // TODO: handle more statuses / edge cases e.g. REFUND
  return 'DONE';
}

async function runMakerNextStep(swapId) {
  console.log('runMakerNextStep');
  const maker = await getMaker();
  const swap = await maker.comitClient.retrieveSwapById(swapId);
  const properties = await parseProperties(swap);

  // 1. Get current status
  const swapStatus = await parseMakerSwapStatus(properties);
  console.log(swapStatus);

  const MAKER_SWAP_STATE_MACHINE = {
    'TAKER_SENT': async params => {
      console.log('running swap.accept');
      await swap.accept(params);
    }, // results in MAKER_ACCEPTED
    'TAKER_LEDGER_FUNDED': async params => {
      console.log('running swap.fund');
      await swap.fund(params);
    }, // results in MAKER_LEDGER_FUNDED
    'TAKER_LEDGER_REDEEMED': async params => {
      console.log('running swap.redeem');
      await swap.redeem(params);
    }, // results in MAKER_LEDGER_REDEEMED
    'DONE': async () => {
      return true;
    },
  }

  // 2. Execute next step
  const tryParams = { maxTimeoutSecs: 10, tryIntervalSecs: 1 }; // TODO: HARDCODED
  await MAKER_SWAP_STATE_MACHINE[swapStatus](tryParams);
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
  parseMakerSwapStatus,
  runMakerNextStep
}
