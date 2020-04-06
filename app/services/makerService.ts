export default class MakerService {
  constructor(url) {
    this.url = url;
  }

  /**
   * Returns the maker's identity.
   */
  async getIdentity() {
    try {
      const result = await fetch(this.url);
      const {
        peerId,
        addressHint,
        ETHAddress,
        BTCAddress
      } = await result.json();
      return { peerId, addressHint, ETHAddress, BTCAddress };
    } catch (error) {
      throw new Error(`getMaker failed: ${error.toString()}`);
    }
  }

  /**
   * Returns the maker's swaps.
   */
  async getSwaps() {
    try {
      const res = await fetch(`${this.url}/swaps`);
      const { swaps } = await res.json();
      return swaps;
    } catch (error) {
      throw new Error(`getSwaps failed: ${error.toString()}`);
    }
  }

  /**
   * Returns the maker's swaps.
   */
  async getRates() {
    try {
      const res = await fetch(`${this.url}/rates`);
      const { rates } = await res.json();
      return rates;
    } catch (error) {
      throw new Error(`getRates failed: ${error.toString()}`);
    }
  }
}
