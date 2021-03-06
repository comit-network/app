const TRY_PARAMS = { maxTimeoutSecs: 10, tryIntervalSecs: 1 };

async function parseStatus(swap) {
  const { properties } = await swap.fetchDetails();
  const { state } = properties;

  const TAKER_SENT =
    state.communication.status === 'SENT';
  if (TAKER_SENT) {
    return 'TAKER_SENT';
  }

  const TAKER_LEDGER_FUNDED =
    state.alpha_ledger.status === 'FUNDED' &&
    state.beta_ledger.status === 'NOT_DEPLOYED';
  if (TAKER_LEDGER_FUNDED) {
    return 'TAKER_LEDGER_FUNDED';
  }

  const TAKER_REDEEMED =
    state.alpha_ledger.status === 'FUNDED' &&
    state.beta_ledger.status === 'REDEEMED';
  if (TAKER_REDEEMED) {
    return 'TAKER_REDEEMED';
  }

  return 'DONE';
}

async function canRefund(swap) {
  const { properties } = await swap.fetchDetails();
  const { state } = properties;

  const MAKER_LEDGER_FUNDED =
    state.beta_ledger.status === 'FUNDED';
  if (MAKER_LEDGER_FUNDED) {
    return true;
  }

  return false;
}

class MakerStateMachine {
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
   * Returns boolean, true if the refund action is available.
   */
  async canRefund() {
    const allowed = await canRefund(this.swap);
    return allowed;
  }

  async refund() {
    const allowed = await canRefund(this.swap);
    if (allowed) {
      try {
        console.log('running swap.refund');
        await this.swap.refund(TRY_PARAMS);
      } catch(error) {
        console.error('refund failed');
        console.error(error);
      }
    }

    return false;
  }

  /**
   * Executes the next step of the swap
   */
  async next() {
    const status = await parseStatus(this.swap);
    const MAKER_SWAP_STATE_MACHINE = {
      'TAKER_SENT': async params => {
        console.log('running swap.accept');
        // TODO: swap.decline is also possible
        await this.swap.accept(params);
      }, // results in MAKER_ACCEPTED
      'TAKER_LEDGER_FUNDED': async params => {
        console.log('running swap.fund');
        await this.swap.fund(params);
      }, // results in MAKER_LEDGER_FUNDED
      'TAKER_REDEEMED': async params => {
        console.log('running swap.redeem');
        await this.swap.redeem(params);
      }, // results in MAKER_LEDGER_REDEEMED
      'DONE': async () => {
        return true;
      },
    }

    // 2. Execute next step
    try {
      await MAKER_SWAP_STATE_MACHINE[status](TRY_PARAMS);
    } catch(error) {
      console.log('Error with next()');
      console.error(error);
    }
  }
}

module.exports = MakerStateMachine;
