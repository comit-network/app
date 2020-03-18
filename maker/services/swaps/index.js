const { NotFound } = require('http-errors')
const {
  getNode,
  getSwaps,
  findSwapById
} = require('../../comit');

module.exports = function (fastify, opts, next) {
  fastify.get('/swaps', async function (request) {
    const swaps = await getSwaps();
    return { swaps };
  })

  fastify.get('/swaps/:id', async function (request) {
    const { id } = request.params;
    const swap = await findSwapById(id);
    if (!swap) {
      throw new NotFound()
    }

    return { swap };
  })

  next()
}
