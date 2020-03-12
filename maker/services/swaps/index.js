const _ = require('lodash');
const { NotFound } = require('http-errors')
const {
  getNode
} = require('../../comit');

async function parseProperties(swaps) {
  const details = await Promise.all(_.map(swaps, s => s.fetchDetails()));
  const properties = _.map(details, s => s['properties']);
  return properties
}

async function getSwaps() {
  const maker = await getNode(0, 'Maker');
  const newSwaps = await maker.comitClient.getNewSwaps();
  const newSwapsProperties = await parseProperties(newSwaps);

  const ongoingSwaps = await maker.comitClient.getOngoingSwaps();
  const ongoingSwapsProperties = await parseProperties(ongoingSwaps);

  const doneSwaps = await maker.comitClient.getDoneSwaps();
  const doneSwapsProperties = await await parseProperties(doneSwaps);

  return [...newSwapsProperties, ...ongoingSwapsProperties, ...doneSwapsProperties];
}

async function findSwapById(id) {
  const swaps = await getSwaps();
  const withId = _.find(swaps, { id });
  return withId;
}

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
