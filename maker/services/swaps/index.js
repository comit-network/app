const {
  getNode
} = require('../../comit');

module.exports = function (fastify, opts, next) {
  fastify.get('/swaps', async function (request) {
    const maker = await getNode(0, 'Maker');
    const swaps = await maker.comitClient.getOngoingSwaps();
    return { swaps };
  })

  next()
}
