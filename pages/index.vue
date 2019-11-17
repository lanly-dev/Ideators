<template lang="pug">
  span
    #l
    gmap-map#map(:center='mapCenter' :zoom=7 map-type-id='terrain')
      gmap-marker(:key='index' v-for='(m, index) in responders' :position='m.position' :clickable='true' @click='markerClicked(m)')
      gmap-info-window(:options='{maxWidth: 300}' :position='infoWindow.position' :opened='infoWindow.open' @closeclick='infoWindow.open=false')
        div
          .row
            .col-12 helloworld
</template>

<script>
export default {
  data() {
    return {
      mapCenter: { lat: 10, lng: 10 },
      infoWindow: {
        name: null,
        position: {}
      },
      responders: [
        { name: 'John', position: { lat: 10, lng: 10 } },
        { name: 'Joe', position: { lat: 10, lng: 11 } }
      ]
    }
  },
  mounted() {
    const l = document.getElementById('l')
    const log = (m) => {
      const i = document.createElement('li')
      i.textContent = new Date().toISOString() + ' ' + m
      l.appendChild(i)
    }
    log('opening websocket connection')
    const s = new WebSocket('ws://localhost:3000')
    // const s = new WebSocket('ws://172.16.94.196:3001')
    s.addEventListener('error', (m) => {
      log('error')
    })
    s.addEventListener('open', (m) => {
      log('websocket connection open')
      s.send('hello')
    })
    s.addEventListener('message', (m) => {
      log(m.data)
    })
  },
  methods: {
    markerClicked(who) {
      Object.assign(this.$data, this.$options.data.apply(this))
      this.infoWindow.position = who.position
      this.infoWindow.open = true
    }
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

#map {
  width: 500px;
  height: 300px;
}

/*style the box which holds the text of the information window*/
.gm-style .gm-style-iw {
  background-color: white !important;
  top: 0 !important;
  left: 0 !important;
  width: 150px !important;
  /* height: 100% !important; */
  /* min-height: 120px !important; */
  padding-top: 10px;
  display: block !important;
}
.gm-style div div div div div div div div {
  background-color: white !important;
  margin: 0;
  padding: 0;
  top: 0;
  color: black;
  font-size: 16px;
}
/*remove litte arrow bottom */
.gm-style .gm-style-iw-t::after {
  content: none !important;
}
</style>
