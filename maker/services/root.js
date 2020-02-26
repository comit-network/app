'use strict'

const { name, version } = require("../package.json");

module.exports = function (fastify, opts, next) {
  fastify.register(require('fastify-cors'), {
    // put your options here
  })

  fastify.get('/', async function (request, reply) {
    return { name, version };
  })

  next()
}
