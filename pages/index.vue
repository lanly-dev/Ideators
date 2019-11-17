<template lang="pug">
  #l
</template>

<script>
export default {
  mounted() {
    const l = document.getElementById('l')
    const log = function(m) {
      const i = document.createElement('li')
      i.textContent = new Date().toISOString() + ' ' + m
      l.appendChild(i)
    }
    log('opening websocket connection')
    const s = new WebSocket('ws://localhost:3000')
    // const s = new WebSocket('ws://172.16.94.196:3001')
    s.addEventListener('error', function(m) {
      log('error')
    })
    s.addEventListener('open', function(m) {
      log('websocket connection open')
    })
    s.addEventListener('message', function(m) {
      log(m.data)
    })
  }
}
</script>

<style>
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.title {
  font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}
</style>
