const {
  loadEnvironment,
  findSwapById
} = require('./comit');

const sleep = m => new Promise(r => setTimeout(r, m))
const pollForever = async (collection, ms) => {
  // Make Async Call
  // for (let item of collection) {
  //   await MakeAsyncCall(item);
  // }
  const swap = await findSwapById('9060bc0a-fd1f-4811-8fb3-f2acb9409991');
  console.log(swap);

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
