async function parseStatus(swap) {
  const { properties } = await swap.fetchDetails();
  const { state } = properties;

  const MAKER_ACCEPTED =
    state.communication.status === 'ACCEPTED' &&
    state.alpha_ledger.status === 'NOT_DEPLOYED';
  if (MAKER_ACCEPTED) {
    return 'MAKER_ACCEPTED';
  }

  const TAKER_LEDGER_DEPLOYED = state.alpha_ledger.status === 'DEPLOYED';
  if (TAKER_LEDGER_DEPLOYED) {
    return 'TAKER_LEDGER_DEPLOYED';
  }

  // const TAKER_LEDGER_FUNDED =
  //   state.alpha_ledger.status === 'FUNDED'
  // if (TAKER_LEDGER_FUNDED) {
  //   return 'TAKER_LEDGER_FUNDED';
  // }
  // TODO: Refund is possible here

  const MAKER_LEDGER_FUNDED = state.beta_ledger.status === 'FUNDED';
  if (MAKER_LEDGER_FUNDED) {
    return 'MAKER_LEDGER_FUNDED';
  }

  return 'DONE';
}

export default class TakerStateMachine {
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
    console.log('runTakerNextStep');
    const status = await parseStatus(this.swap);
    console.log(status);
    const TAKER_SWAP_STATE_MACHINE = {
      MAKER_ACCEPTED: async params => {
        console.log('running swap.deploy');
        await this.swap.deploy(params);
      }, // results in TAKER_LEDGER_FUNDED
      TAKER_LEDGER_DEPLOYED: async params => {
        console.log('running swap.fund');
        await this.swap.fund(params);
      }, // results in TAKER_LEDGER_FUNDED
      MAKER_LEDGER_FUNDED: async params => {
        // TODO: swap.refund is also possible here
        // Note refund is possible when alpha ledger is Funded but not Redeemed
        console.log('running swap.redeem');
        await this.swap.redeem(params);
      }, // results in TAKER_LEDGER_REDEEMED
      DONE: async () => {
        return true; // noop
      } // Let user know that swap is done
    };

    console.log('Executing next step...');
    const TRY_PARAMS = { maxTimeoutSecs: 30, tryIntervalSecs: 1 };
    await TAKER_SWAP_STATE_MACHINE[status](TRY_PARAMS);
    console.log('Next step executed');
  }
}
