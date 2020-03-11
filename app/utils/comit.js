import dotenv from 'dotenv';
import {
  // Actor,
  // BigNumber,
  createActor,
  EthereumWallet,
  InMemoryBitcoinWallet
  // SwapRequest
} from 'comit-sdk';
import fs from 'fs';
import os from 'os';
import path from 'path';
import moment from 'moment';
import { toSatoshi } from 'satoshi-bitcoin-ts';
import toBaseUnit from './index';

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

export async function getNode(index, name) {
  const bitcoinWallet = await InMemoryBitcoinWallet.newInstance(
    'regtest',
    process.env.BITCOIN_P2P_URI,
    process.env[`BITCOIN_HD_KEY_${index}`]
  );

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
