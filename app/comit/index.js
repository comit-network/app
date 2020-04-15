import { createActor, EthereumWallet, InMemoryBitcoinWallet } from 'comit-sdk';
import moment from 'moment';
import { toSatoshi } from 'satoshi-bitcoin-ts';
import toBaseUnit from '../utils';

export { default as TakerStateMachine } from './stateMachine';

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

// TODO: SDK should have this, should be wrapper of just plain this.cnd.getSwaps()
export async function getSwaps() {
  const taker = await getTaker();
  const newSwaps = await taker.comitClient.getNewSwaps();
  const ongoingSwaps = await taker.comitClient.getOngoingSwaps();
  const doneSwaps = await taker.comitClient.getDoneSwaps();

  return [...newSwaps, ...ongoingSwaps, ...doneSwaps];
}

export async function findSwapById(actor, swapId) {
  const swap = await actor.comitClient.retrieveSwapById(swapId);
  const { properties } = await swap.fetchDetails();
  return properties;
}

export function buildSwap(
  makerPeerId,
  makerAddressHint,
  takerETHAddress,
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
    alpha_ledger_refund_identity: takerETHAddress,
    alpha_expiry: moment().unix() + 7200,
    beta_expiry: moment().unix() + 3600,
    peer: {
      peer_id: makerPeerId,
      address_hint: makerAddressHint
    }
  };
  console.log(message);
  return message;
}
