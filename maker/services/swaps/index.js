const {
  loadEnvironment,
  initializeNodes
} = require('./comit');

module.exports = function (fastify, opts, next) {
  fastify.post('/swaps', async function (request) {
    loadEnvironment();
    const maker = await initializeNodes(0, 'Maker');

    // TODO
    return { hello: 'world' };
  })

  next()
}
