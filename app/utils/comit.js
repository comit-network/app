import dotenv from 'dotenv';
import { createActor, EthereumWallet, InMemoryBitcoinWallet } from 'comit-sdk';
import fs from 'fs';
import os from 'os';
import path from 'path';
import moment from 'moment';
import { toSatoshi } from 'satoshi-bitcoin-ts';
import toBaseUnit from './index';

export async function getNode(index, name) {
  const bitcoinWallet = await InMemoryBitcoinWallet.newInstance(
    'regtest',
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

export async function getTaker() {
  const taker = await getNode(1, 'Taker');
  return taker;
}

export async function parseProperties(swap) {
  const { properties } = await swap.fetchDetails();
  return properties;
}

export function parseTakerSwapStatus(swapProperties) {
  const { state } = swapProperties;

  const MAKER_ACCEPTED =
    state.communication.status === 'ACCEPTED' &&
    state.alpha_ledger.status === 'NOT_DEPLOYED' &&
    state.beta_ledger.status === 'NOT_DEPLOYED';
  if (MAKER_ACCEPTED) {
    return 'MAKER_ACCEPTED';
  }

  const TAKER_LEDGER_DEPLOYED =
    state.alpha_ledger.status === 'DEPLOYED' &&
    state.beta_ledger.status === 'NOT_DEPLOYED';
  if (TAKER_LEDGER_DEPLOYED) {
    return 'TAKER_LEDGER_DEPLOYED';
  }

  const MAKER_LEDGER_FUNDED =
    state.alpha_ledger.status === 'FUNDED' &&
    state.beta_ledger.status === 'FUNDED';
  if (MAKER_LEDGER_FUNDED) {
    return 'MAKER_LEDGER_FUNDED';
  }

  const MAKER_LEDGER_REDEEMED =
    state.alpha_ledger.status === 'REDEEMED' &&
    state.beta_ledger.status === 'REDEEMED';
  if (MAKER_LEDGER_REDEEMED) {
    return 'MAKER_LEDGER_REDEEMED';
  }

  // TODO: handle additional statuses and edge cases
  return 'DONE';
}

export async function runTakerNextStep(swapId) {
  console.log('runTakerNextStep');
  const taker = await getTaker();
  const swap = await taker.comitClient.retrieveSwapById(swapId);
  const properties = await parseProperties(swap);

  console.log('parseTakerSwapStatus');
  const swapStatus = parseTakerSwapStatus(properties);
  console.log(swapStatus);

  const TAKER_SWAP_STATE_MACHINE = {
    MAKER_ACCEPTED: async params => {
      console.log('running swap.deploy');
      await swap.deploy(params);
    }, // results in TAKER_LEDGER_FUNDED
    TAKER_LEDGER_DEPLOYED: async params => {
      console.log('running swap.fund');
      await swap.fund(params);
    }, // results in TAKER_LEDGER_FUNDED
    MAKER_LEDGER_FUNDED: async params => {
      console.log('running swap.redeem');
      await swap.redeem(params);
    }, // results in TAKER_LEDGER_REDEEMED
    MAKER_LEDGER_REDEEMED: async () => {
      return true; // noop
    },
    DONE: async () => {
      return true; // noop
    } // Let user know that swap is done
  };

  console.log('Executing next step...');
  const TRY_PARAMS = { maxTimeoutSecs: 10, tryIntervalSecs: 1 };
  await TAKER_SWAP_STATE_MACHINE[swapStatus](TRY_PARAMS);
  console.log('Next step executed');
}

export function loadEnvironment() {
  // TODO: change this to use .env within the `maker` directory
  const envFilePath = path.join(os.homedir(), '.create-comit-app', 'env');

  if (!fs.existsSync(envFilePath)) {
    console.log(
      'Could not find file %s. Did you run `yarn start-env`?',
      envFilePath
    );
    process.exit(1);
  }

  dotenv.config({ path: envFilePath });
}

export function buildSwap(
  makerPeerId,
  makerAddressHint,
  takerETHAddress,
  daiAmount,
  btcAmount
) {
  return {
    alpha_ledger: {
      name: 'ethereum',
      chain_id: 17
    },
    beta_ledger: {
      name: 'bitcoin',
      network: 'regtest'
    },
    alpha_asset: {
      name: 'erc20',
      token_contract: process.env.ERC20_CONTRACT_ADDRESS,
      quantity: toBaseUnit(daiAmount.toString(), 18).toString() // ERC20 amount in 18 decimals, converted from float
    },
    beta_asset: {
      name: 'bitcoin',
      quantity: toSatoshi(btcAmount).toString()
    },
    alpha_ledger_refund_identity: takerETHAddress,
    alpha_expiry: moment().unix() + 7200,
    beta_expiry: moment().unix() + 3600,
    peer: {
      peer_id: makerPeerId,
      address_hint: makerAddressHint
    }
  };
}
