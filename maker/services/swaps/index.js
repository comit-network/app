// import {
//   Actor,
//   BigNumber,
//   createActor as createActorSdk,
//   EthereumWallet,
//   InMemoryBitcoinWallet,
//   SwapRequest,
// } from "comit-sdk";

module.exports = function (fastify, opts, next) {
  fastify.post('/swaps', async function (request) {

    // TODO
    console.log(request);
    return { rates: json };
  })

  next()
}
