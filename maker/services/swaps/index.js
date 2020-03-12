const _ = require('lodash');
const {
  getNode
} = require('../../comit');

async function parseProperties(swaps) {
  const details = await Promise.all(_.map(swaps, s => s.fetchDetails()));
  const properties = _.map(details, s => s['properties']);
  return properties
}

module.exports = function (fastify, opts, next) {
  fastify.get('/swaps', async function (request) {
    const maker = await getNode(0, 'Maker');
    const newSwaps = await maker.comitClient.getNewSwaps();
    const newSwapsProperties = await parseProperties(newSwaps);

    const ongoingSwaps = await maker.comitClient.getOngoingSwaps();
    const ongoingSwapsProperties = await parseProperties(ongoingSwaps);

    const doneSwaps = await maker.comitClient.getDoneSwaps();
    const doneSwapsProperties = await await parseProperties(doneSwaps);

    return { new: newSwapsProperties, ongoing: ongoingSwapsProperties, done: doneSwapsProperties };
  })

  fastify.get('/swaps/:id', async function (request) {
    const { id } = request.params;



    return request.params;
  })

  next()
}
