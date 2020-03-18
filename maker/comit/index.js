const _ = require('lodash');
const dotenv = require("dotenv");
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

async function parseProperties(swaps) {
  const details = await Promise.all(_.map(swaps, s => s.fetchDetails()));
  const properties = _.map(details, s => s['properties']);
  return properties
}

async function getSwaps() {
  const maker = await getMaker();
  const newSwaps = await maker.comitClient.getNewSwaps();
  const newSwapsProperties = await parseProperties(newSwaps);

  const ongoingSwaps = await maker.comitClient.getOngoingSwaps();
  const ongoingSwapsProperties = await parseProperties(ongoingSwaps);

  const doneSwaps = await maker.comitClient.getDoneSwaps();
  const doneSwapsProperties = await await parseProperties(doneSwaps);

  return [...newSwapsProperties, ...ongoingSwapsProperties, ...doneSwapsProperties];
}

async function findSwapById(id) {
  // TODO: refactor with maker.comitClient.retrieveSwapById(swapId);
  const swaps = await getSwaps();
  const withId = _.find(swaps, { id });
  return withId;
}

async function getMakerSwapStatus(swapId) {
  const { state } = await findSwapById(swapId);

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
  throw new Error('UNHANDLED status');
}

async function getTakerSwapStatus(swapId) {
  const { state } = await findSwapById(swapId);

  const MAKER_ACCEPTED = (state.communication.status === 'ACCEPTED' && state.alpha_ledger.status === 'NOT_DEPLOYED' && state.beta_ledger.status === 'NOT_DEPLOYED')
  if (MAKER_ACCEPTED) {
    return 'MAKER_ACCEPTED';
  }

  const TAKER_LEDGER_DEPLOYED = (state.alpha_ledger.status === 'DEPLOYED' && state.beta_ledger.status === 'NOT_DEPLOYED')
  if (TAKER_LEDGER_DEPLOYED) {
    return 'TAKER_LEDGER_DEPLOYED';
  }

  const MAKER_LEDGER_FUNDED = (state.alpha_ledger.status === 'FUNDED' && state.beta_ledger.status === 'FUNDED')
  if (MAKER_LEDGER_FUNDED) {
    return 'MAKER_LEDGER_FUNDED';
  }

  const MAKER_LEDGER_REDEEMED = (state.alpha_ledger.status === 'REDEEMED' && state.beta_ledger.status === 'REDEEMED');
  if (MAKER_LEDGER_REDEEMED) {
    return 'MAKER_LEDGER_REDEEMED';
  }

  throw new Error('UNHANDLED status');
}

async function getMakerNextStep(swapId) {
  const maker = await getMaker();
  const makerSwapHandle = await maker.comitClient.retrieveSwapById(swapId);

  const tryParams = { maxTimeoutSecs: 10, tryIntervalSecs: 1 };
  const MAKER_SWAP_STATE_MACHINE = {
    'TAKER_SENT': makerSwapHandle.accept(tryParams), // results in MAKER_ACCEPTED
    'TAKER_LEDGER_FUNDED': makerSwapHandle.fund(tryParams), // results in MAKER_LEDGER_FUNDED
    'TAKER_LEDGER_REDEEMED': makerSwapHandle.redeem(tryParams), // results in MAKER_LEDGER_REDEEMED
  }
  const swapStatus = await getSwapStatus(swapId);
  return MAKER_SWAP_STATE_MACHINE[swapStatus];
}

async function getTakerNextStep(swapId) {
  const taker = await getTaker();
  const takerSwapHandle = await taker.comitClient.retrieveSwapById(swapId);

  const tryParams = { maxTimeoutSecs: 10, tryIntervalSecs: 1 };
  const TAKER_SWAP_STATE_MACHINE = {
    'MAKER_ACCEPTED': takerSwapHandle.deploy(tryParams), // results in TAKER_LEDGER_FUNDED
    'TAKER_LEDGER_DEPLOYED': takerSwapHandle.fund(tryParams), // results in TAKER_LEDGER_FUNDED
    'MAKER_LEDGER_FUNDED': takerSwapHandle.redeem(tryParams), // results in TAKER_LEDGER_REDEEMED
    'MAKER_LEDGER_REDEEMED': () => { console.log(done) } // Let user know that swap is done
  }
  const swapStatus = await getSwapStatus(swapId);
  return TAKER_SWAP_STATE_MACHINE[swapStatus];
}

function loadEnvironment() {
  // TODO: change this to use .env within the `maker` directory
  const envFilePath = path.join(os.homedir(), ".create-comit-app", "env");

  if (!fs.existsSync(envFilePath)) {
      console.log(
          "Could not find file %s. Did you run `yarn start-env`?",
          envFilePath
      );
      process.exit(1);
  }

  dotenv.config({ path: envFilePath });
}

async function getMaker() {
  const maker = await getNode(0, 'Maker');
  return maker;
}

async function getTaker() {
  const taker = await getNode(1, 'Taker');
  return taker;
}

async function getNode(index, name) {
  const bitcoinWallet = await InMemoryBitcoinWallet.newInstance(
    "regtest",
    process.env.BITCOIN_P2P_URI,
    process.env[`BITCOIN_HD_KEY_${index}`]
  );
  await new Promise(r => setTimeout(r, 1000)); // TODO: why is this here

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
  loadEnvironment,
  getNode,
  getMaker,
  getSwaps,
  findSwapById,
  getMakerSwapStatus,
  getMakerNextStep
}
