'use strict'

const { name, version } = require("../package.json");
const {
  loadEnvironment,
  getNode
} = require('../comit');

module.exports = function (fastify, opts, next) {
  loadEnvironment(); // COMIT

  fastify.register(require('fastify-cors'), {
    // put your options here
  })

  fastify.get('/', async function (request, reply) {
    const maker = await getNode(0, 'Maker');
    const { peerId, addressHint } = maker;
    const ETHAddress = await maker.ethereumWallet.getAccount();
    const BTCAddress = await maker.bitcoinWallet.getAddress();

    return { name, version, peerId, addressHint, ETHAddress, BTCAddress };
  })

  next()
}
