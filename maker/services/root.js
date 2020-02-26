'use strict'

module.exports = function (fastify, opts, next) {
  fastify.register(require('fastify-cors'), {
    // put your options here
    origin: (origin, cb) => {
      if(/localhost/.test(origin)){
        //  Request from localhost will pass
        cb(null, true)
        return
      }
      cb(new Error("Not allowed"), false)
    }
  })

  fastify.get('/', function (request, reply) {
    reply.send({ root: true })
  })

  next()
}

// If you prefer async/await, use the following
//
// module.exports = async function (fastify, opts) {
//   fastify.get('/', async function (request, reply) {
//     return { root: true }
//   })
// }
