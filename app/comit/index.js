import _ from 'lodash';
import moment from 'moment';
import { toSatoshi } from 'satoshi-bitcoin-ts';
import { Swap } from 'comit-sdk';
import toBaseUnit from '../utils';

export { default as TakerStateMachine } from './stateMachine';

function newSwap(swap, cnd, bitcoinWallet, ethereumWallet) {
  if (!bitcoinWallet) {
    throw new Error('BitcoinWallet is not set.');
  }

  if (!ethereumWallet) {
    throw new Error('EthereumWallet is not set.');
  }

  return new Swap(
    cnd,
    swap.links.find(link => link.rel.includes('self')).href,
    { bitcoin: bitcoinWallet, ethereum: ethereumWallet }
  );
}

// This function should be part of the SDK
export async function getSwaps(cnd, bitcoinWallet, ethereumWallet) {
  const swapSubEntities = await cnd.getSwaps();
  const swaps = swapSubEntities.map(swap =>
    newSwap(swap, cnd, bitcoinWallet, ethereumWallet)
  );
  return swaps;
}

export async function fetchProperties(swaps) {
  const result = await Promise.all(_.map(swaps, s => s.fetchDetails()));
  const propertiesList = _.map(result, details => {
    const { properties } = details;
    return properties;
  });
  return propertiesList;
}

export async function fetchPropertiesById(client, swapId) {
  const swap = await client.retrieveSwapById(swapId);
  const { properties } = await swap.fetchDetails();
  return properties;
}

// Note: this is only for Alpha: DAI and Beta: BTC
export function buildSwap(
  makerPeerId,
  makerAddressHint,
  takerRefundAddress,
  daiAmount,
  btcAmount
) {
  const message = {
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
    alpha_ledger_refund_identity: takerRefundAddress,
    alpha_expiry: moment().unix() + 7200,
    beta_expiry: moment().unix() + 3600,
    peer: {
      peer_id: makerPeerId,
      address_hint: makerAddressHint
    }
  };
  return message;
}
