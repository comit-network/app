const {
  loadEnvironment,
  getSwaps,
  findSwapById,
  parseMakerSwapStatus, // optional
  runMakerNextStep
} = require('./comit');

const sleep = m => new Promise(r => setTimeout(r, m))
const pollForever = async (collection, ms) => {
  const swaps = await getSwaps(); // Get all swaps

  console.log(`== checking status of ${swaps.length} swaps`)
  for (let swap of swaps) {
    console.log(swap.id);
    await runMakerNextStep(swap.id);
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
