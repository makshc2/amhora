import Vue from 'vue'
import App from './App'
import router from './router'
import 'vue-directive-tooltip/src/css/index.scss'
import './styles/styles.scss'
import store from './store'
import vuexI18n from 'vuex-i18n/dist/vuex-i18n.cjs'
import Tooltip from 'vue-directive-tooltip'
import { INIT_LOCAL } from './services/util'
import { translationsEn } from './assets/resources/i18n/en'
import { translationsRu } from './assets/resources/i18n/ru'
import VueClipboards from 'vue-clipboards'
import moment from 'moment'
import { directive as onClickOutside } from 'vue-on-click-outside'
import { Calendar, DatePicker } from 'v-calendar'
import './plugin/quasar'
import './plugin/vee-validate'
import 'quasar/dist/quasar.min.css'
import 'v-calendar/lib/v-calendar.min.css'
import './plugin/axios-config'
import VueMeta from 'vue-meta'
import interceptorsSetup from './helpers/interceptors/index.js'
import vueHeadful from 'vue-headful'

Vue.component('vue-headful', vueHeadful)

interceptorsSetup()
Vue.use(VueMeta, {
  refreshOnceOnNavigation: true
})
Vue.config.productionTip = false
Vue.use(vuexI18n.plugin, store)
Vue.i18n.add('en', translationsEn)
Vue.i18n.add('ru', translationsRu)
Vue.i18n.set(INIT_LOCAL())
Vue.use(Tooltip, {
  placement: 'top',
  class: 'tooltip-white',
  offset: 0,
  delay: 100
})
Vue.use(VueClipboards)
Vue.component('v-calendar', Calendar)
Vue.component('v-datepicker', DatePicker)
Vue.directive('on-click-outside', onClickOutside)

Vue.filter('orAddrNa', (source) => source || 'Address unavailable')
Vue.filter('formatDate', value => {
  if (!value || typeof value !== 'number') {
    return ''
  }
  return moment(value * 1000).locale(store.state.language).format('DD MMMM YYYY, hh:mm:ss A')
})
Vue.filter('timeOnly', value => {
  if (!value || typeof value !== 'number') {
    return ''
  }
  return moment(value * 1000).locale(store.state.language).format('hh:mm:ss A')
})
Vue.filter('capitalize', value => {
  if (!value) return ''
  value = value.toString()
  return value.charAt(0).toUpperCase() + value.slice(1)
})

/* eslint-disable no-new */
new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')
