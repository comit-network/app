const { getMaker, parseProperties } = require('./index');

async function parseStatus(swap) {
  const { properties } = await swap.fetchDetails();
  const { state } = properties;

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

export default class MakerStateMachine {
  constructor(swap) {
    this.swap = swap;
  }

  /**
   * Returns the current's status of the swap.
   */
  async getStatus() {
    const status = await parseStatus(this.swap);
    return status;
  }

  /**
   * Executes the next step of the swap
   */
  async next() {
    const status = await parseStatus(this.swap);
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
    await MAKER_SWAP_STATE_MACHINE[status](tryParams);
  }
}
