import Vue from 'nativescript-vue'
import App from './components/App'

import ImageCacheIt from 'nativescript-image-cache-it/vue'

import store from './store'

require ("nativescript-local-notifications")


Vue.use(ImageCacheIt)
  
// Prints Vue logs when --env.production is *NOT* set while building
Vue.config.silent = (TNS_ENV === 'production')

new Vue({
  store,
  render: h => h('frame', [h(App)])
}).$start()
