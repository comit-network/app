const {
  getNode
} = require('../../comit');

module.exports = function (fastify, opts, next) {
  fastify.post('/swaps', async function (request) {
    const maker = await getNode(0, 'Maker');

    // TODO: swap.accept(...)
    return { hello: 'world' };
  })

  fastify.get('/swaps', async function (request) {
    const maker = await getNode(0, 'Maker');
    const swaps = await maker.comitClient.getNewSwaps();
    return { swaps };
  })

  next()
}
