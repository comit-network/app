export default class Orderbook {
  constructor(cnd) {
    this.cnd = cnd;
  }

  /**
   * Returns a list of orders.
   */
  // eslint-disable-next-line class-methods-use-this
  async getOrders() {
    const orders = {
      entities: [
        {
          id: '',
          makerId: '123',
          side: 'buy',
          makerAssetQuantity: 1,
          takerAssetQuantity: 2,
          signature: '',
          expires: 123,
          expiryLength: 7200
        }
      ]
    };
    return orders;
  }

  // eslint-disable-next-line class-methods-use-this
  async placeOrder(_order_) {
    return 'TODO';
  }

  // eslint-disable-next-line class-methods-use-this
  async takeOrder(_orderId_) {
    return 'TODO';
  }

  // eslint-disable-next-line class-methods-use-this
  async getMakers() {
    return 'TODO';
  }

  // eslint-disable-next-line class-methods-use-this
  async subscribe(_makerId_, _pair_) {
    return 'TODO';
  }
}
