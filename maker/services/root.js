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
    const { peerId, addressHint } = await getNode(0, 'Maker');

    return { name, version, peerId, addressHint };
  })

  next()
}
