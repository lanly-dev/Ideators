const express = require('express')
const consola = require('consola')
const { Nuxt, Builder } = require('nuxt')
const app = express()
const ws = require('express-ws')(app)
const config = require('../nuxt.config.js')
config.dev = process.env.NODE_ENV !== 'production'
const RCLIENTS = []
const CCLIENTS = []

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
    s.on('message', (msg) => {
      msg = JSON.parse(msg)
      if (!s.id) {
        s.id = msg.id
        if (s.id === 'dashboard') {
          CCLIENTS.push(s)
        } else RCLIENTS.push(s)
      }
      if (s.id !== 'dashboard') {
        for (let i = 0; i < CCLIENTS.length; i++) {
          if (CCLIENTS[i].readyState === 1)
            CCLIENTS[i].send(JSON.stringify(msg))
          else if (s.readyState === 3) {
            CCLIENTS.splice(index, 1)
            i--
          }
        }
      }
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
