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

function loadEnvironment() {
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

async function initializeNodes(index, name) {
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

module.exports = {
  loadEnvironment,
  initializeNodes
};
