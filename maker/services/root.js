'use strict'

require('dotenv').config();
const { name, version } = require("../package.json");
const {
  getNode
} = require('../comit');

module.exports = function (fastify, opts, next) {
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
