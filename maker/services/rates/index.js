'use strict'

const fetch = require('node-fetch');

module.exports = function (fastify, opts, next) {
  fastify.get('/rates', async function (request, reply) {
    const data = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=dai&vs_currencies=btc');
    const json = await data.json(); // {"dai":{"btc":0.0001091}}
    return { rates: json };
  })

  next()
}
