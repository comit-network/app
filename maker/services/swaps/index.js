const _ = require('lodash');
const {
  getNode
} = require('../../comit');

module.exports = function (fastify, opts, next) {
  fastify.get('/swaps', async function (request) {
    const maker = await getNode(0, 'Maker');
    const newSwaps = await maker.comitClient.getNewSwaps();
    const newSwapsDetails = await Promise.all(_.map(newSwaps, s => s.fetchDetails()));
    const newSwapsProperties = _.map(newSwapsDetails, s => s['properties']);

    const ongoingSwaps = await maker.comitClient.getOngoingSwaps();
    const ongoingSwapsDetails = await Promise.all(_.map(ongoingSwaps, s => s.fetchDetails()));
    const ongoingSwapsProperties = _.map(ongoingSwapsDetails, s => s['properties']);

    const doneSwaps = await maker.comitClient.getDoneSwaps();
    const doneSwapsDetails = await Promise.all(_.map(doneSwaps, s => s.fetchDetails()));
    const doneSwapsProperties = _.map(doneSwapsDetails, s => s['properties']);

    return { new: newSwapsProperties, ongoing: ongoingSwapsProperties, done: doneSwapsProperties };
  })

  next()
}
