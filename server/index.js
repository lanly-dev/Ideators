const express = require('express')
const consola = require('consola')
const { Nuxt, Builder } = require('nuxt')
const app = express()
const ws = require('express-ws')(app)
const config = require('../nuxt.config.js')
config.dev = process.env.NODE_ENV !== 'production'
const CLIENTS = []

async function start() {
  const nuxt = new Nuxt(config)
  const { host, port } = nuxt.options.server

  // Build only in dev mode
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  } else {
    await nuxt.ready()
  }

  app.ws('/', (s, req) => {
    console.log('websocket connection')
    CLIENTS.push[s]

    s.on('message', (msg) => {
      console.log(msg)
      console.log(ws.getWss())
    })

    // Sending back
    // for (let t = 0;t < 3;t++) {
    //   setTimeout(() => s.send('message from server',() => { }),1000 * t)
    // }
  })

  app.use(nuxt.render)
  app.listen(port, host)
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })
}
start()
