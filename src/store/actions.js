import { GET_CURRENCY, GET_GLOBAL_RATE_MARKET_GLOBAL, GET_GLOBAL_RATE_MARKET, GET_RATES } from '../services/requests'
import { SEND_LOGGS_TO_SENTRY } from '../services/logging'
import { HANDLING_ERROR } from '../services/util'
import { config } from '../GlobalConfig'

export default {

  GET_CURRENCY (store) {
    return new Promise((resolve, reject) => {
      GET_CURRENCY('crypto')
        .then(resp => {
          resp.forEach(elem => {
            let temp = store.getters.currencyButtons.find((currency) => {
              return currency.name === elem.name
            })
            if (temp === undefined) {
              store.commit('ADDED_NEW_CRYPTO_BUTTON', elem)
            }
          })
          resolve()
        })
        .catch(error => {
          store.dispatch('LOG_ERR', { error: error, url: document.location.href })
          reject(error)
        })
    })
  },
  GET_CURRENCY_FIAT (store) {
    return new Promise((resolve, reject) => {
      GET_CURRENCY('fiat')
        .then(resp => {
          resp.forEach(elem => {
            let temp = store.getters.fiats.find((currency) => currency.name === elem.name)
            if (temp === undefined) {
              store.commit('ADDED_FIATS', elem)
            }
          })
          resolve()
        })
        .catch(error => {
          store.dispatch('LOG_ERR', { error: error, url: 'Error Loading Fiat' })
          reject(error)
        })
    })
  },
  GET_MARKET_RATE (store) {
    return new Promise((resolve, reject) => {
      GET_GLOBAL_RATE_MARKET()
        .then(resp => {
          for (let market in resp) {
            store.commit('SET_LAST_EXCHANGE_RESPONSE', { name: market, value: +new Date() })
            store.dispatch('SET_INFO_FOR_MARKET', { name: market, value: resp[market] })
          }
          resolve()
        })
        .catch(error => {
          store.dispatch('LOG_ERR', { error: error, url: document.location.href })
          reject(error)
        })
    })
  },
  GET_GLOBAL_RATE (store) {
    return new Promise((resolve, reject) => {
      let fiat = store.getters.fiat
      GET_GLOBAL_RATE_MARKET_GLOBAL(fiat)
        .then(resp => {
          store.commit('SET_LAST_EXCHANGE_RESPONSE', { name: 'global', value: +new Date() })
          store.dispatch('SET_INFO_FOR_MARKET', { name: 'global', value: resp })
          resolve()
        })
        .catch(error => {
          store.dispatch('LOG_ERR', { error: error, url: document.location.href })
          reject(error)
        })
    })
  },
  LOG_ERR (store, { error, url }) {
    const $t = this._vm.$t
    SEND_LOGGS_TO_SENTRY(error)
    if (document.location.href) {
      store.commit('SET_ERROR', {
        msg: HANDLING_ERROR(error, $t),
        url: url
      })
    }
  },
  GET_RATES (store, params) {
    return GET_RATES(params)
      .then(resp => {
        store.commit('SET_RATE', resp)
        return resp
      })
      .catch(error => {
        store.dispatch('LOG_ERR', { error: error, url: config.apiServer + 'rates/' + store.getters.fiat })
      })
  },
  SET_INFO_FOR_MARKET ({ state, commit }, infoForMarket) {
    if (infoForMarket.value && !Array.isArray(infoForMarket.value)) {
      let current = state.infoForMarket[infoForMarket.name]
      let nameCrypto = infoForMarket.value.name
      let index = current.findIndex(item => item.name === nameCrypto)
      current.splice(index, 1)
      current.push(infoForMarket.value)
      infoForMarket.value = current
    }
    commit('SET_INFO_FOR_MARKET', infoForMarket)
  }
}
