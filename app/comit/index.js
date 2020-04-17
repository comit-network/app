import moment from 'moment';
import { toSatoshi } from 'satoshi-bitcoin-ts';
import toBaseUnit from '../utils';

export { default as TakerStateMachine } from './stateMachine';

// TODO: SDK should have this, should be wrapper of just plain this.cnd.getSwaps()
// export async function getSwaps(actor) {
//   const newSwaps = await actor.comitClient.getNewSwaps();
//   const ongoingSwaps = await actor.comitClient.getOngoingSwaps();
//   const doneSwaps = await actor.comitClient.getDoneSwaps();

//   return [...newSwaps, ...ongoingSwaps, ...doneSwaps];
// }

export async function fetchDetailsById(client, swapId) {
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
