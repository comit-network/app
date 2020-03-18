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

async function findSwapById(swapId) {
  const maker = await getMaker();
  const s = await maker.comitClient.retrieveSwapById(swapId);
  const properties = await parseProperties([s]);
  return properties[0];
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
  return 'DONE';
}

async function getMakerNextStep(swapId) {
  const maker = await getMaker();
  const makerSwapHandle = await maker.comitClient.retrieveSwapById(swapId);

  const tryParams = { maxTimeoutSecs: 10, tryIntervalSecs: 1 };
  const MAKER_SWAP_STATE_MACHINE = {
    'TAKER_SENT': makerSwapHandle.accept(tryParams), // results in MAKER_ACCEPTED
    'TAKER_LEDGER_FUNDED': makerSwapHandle.fund(tryParams), // results in MAKER_LEDGER_FUNDED
    'TAKER_LEDGER_REDEEMED': makerSwapHandle.redeem(tryParams), // results in MAKER_LEDGER_REDEEMED
    'DONE': () => {
      return true;
    },
  }
  const swapStatus = await getMakerSwapStatus(swapId);
  return MAKER_SWAP_STATE_MACHINE[swapStatus];
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
