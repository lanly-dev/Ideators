<template lang="pug">
  span
    #l
    gmap-map#map(:center='mapCenter' :zoom=7 map-type-id='terrain')
      gmap-marker(:key='index' v-for='(m, index) in responders' :position='m.position' :clickable='true' @click='markerClicked(m)')
      gmap-info-window(:options='{maxWidth: 300}' :position='infoWindow.position' :opened='infoWindow.open' @closeclick='infoWindow.open=false')
        div
          .row
            .col-9 {{infoWindow.id}}
            .col-3 {{infoWindow.hr}}
</template>

<script>
export default {
  data() {
    return {
      mapCenter: { lat: 10, lng: 10 },
      infoWindow: {
        id: null,
        hr: null,
        position: {}
      },
      responders: []
    }
  },
  watch: {
    responders: {
      handler(val, oldVal) {
        if(val.hr !== oldVal.hr) return true
        if(val.position.lat !== oldVal.position.lng) return true
        if(val.position.lng !== oldVal.position.lng) return true
        return false
      },
      deep: true
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
    let wssAdress
    if (window.location.hostname === 'localhost')
      wssAdress = `ws://${window.location.hostname}:3000`
    else wssAdress = `wss://${window.location.hostname}`
    const s = new WebSocket(wssAdress)
    // const s = new WebSocket('ws://172.16.94.196:3001')
    s.addEventListener('error', (m) => {
      log('error')
    })
    s.addEventListener('open', (m) => {
      log('websocket connection open')
      s.send(JSON.stringify({ id: 'dashboard' }))
    })
    const _this = this
    const handler = function(m) {
      console.log('$$$$$$$$$$$$$$$$$$$$')
      console.log(m)
      console.log(_this.$data.responders)
      log(m.data)
      m = JSON.parse(m.data)
      let found = false
      if (_this.$data.responders.length === 0) _this.$data.responders.push(m)
      else {
        for (let i = 0; i < _this.$data.responders.length; i++) {
          if (_this.$data.responders[i].id === m.id) {
            _this.$data.responders[i] = m
            found = true
          }
        }
        if (!found) _this.$data.responders.push(m)
      }
    }
    s.onmessage = handler
  },
  methods: {
    markerClicked(who) {
      Object.assign(this.$data, this.$options.data.apply(this))
      this.infoWindow.position = who.position
      this.infoWindow.id = who.id
      this.infoWindow.hr = who.hr
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
