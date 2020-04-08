async function parseStatus(swap) {
  const { properties } = await swap.fetchDetails();
  const { state } = properties;

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

  const MAKER_LEDGER_FUNDED = state.alpha_ledger.status === 'FUNDED';
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
        console.log('running swap.redeem');
        await this.swap.redeem(params);
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
    await TAKER_SWAP_STATE_MACHINE[status](TRY_PARAMS);
    console.log('Next step executed');
  }
}
