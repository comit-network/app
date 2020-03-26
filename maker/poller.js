const {
  loadEnvironment,
  getSwaps,
  findSwapById,
  parseMakerSwapStatus, // optional
  runMakerNextStep,
  getMaker
} = require('./comit');


const fetchBalances = async () => {
  const m = await getMaker();
  const bitcoinBalance = await m.bitcoinWallet.getBalance();
  const erc20Balance = await m.ethereumWallet.getErc20Balance(
    process.env.ERC20_CONTRACT_ADDRESS
  );
  return { btc: bitcoinBalance, dai: erc20Balance.toNumber()}
}

const sleep = m => new Promise(r => setTimeout(r, m))
const pollForever = async (collection, ms) => {
  const swaps = await getSwaps(); // TODO: filter out and ignore DONE swaps
  const { btc, dai } = await fetchBalances();

  console.log(`BTC: ${btc} - DAI: ${dai}`);
  console.log(`== checking status of ${swaps.length} swaps`)
  for (let swap of swaps) {
    console.log(swap.id);
    try {
      await runMakerNextStep(swap.id);
    } catch(err) {
      console.log('NEXT STEP FAILED');
      console.log(err);
    }
  }

  // Wait X ms Before Processing Continues
  await sleep(ms);

  if (true) { // not needed, but there you could define an end condition
    return pollForever(collection, ms);
  }
};

(async() => {
  loadEnvironment();
  console.log('Start polling');
  await pollForever([], 1000); // 1s interval
})();
