import { config } from '../GlobalConfig.js'

var rp = require('request-promise')

export const GET_CURRENCY = (type) => {
  const options = {
    method: 'GET',
    json: true,
    uri: config.apiServer + 'currencies?type=' + type
  }
  return rp(options)
}
export const GET_RATES = (params) => {
  const options = {
    method: 'GET',
    json: true,
    uri: config.wsServer + 'events',
    qs: params
  }
  return rp(options)
}

export const GET_BTC_FAMILY_TRANSACTIONS = (currency, address, params) => {
  const options = {
    method: 'GET',
    json: true,
    uri: config.apiServer + 'currencies/' + currency + '/addresses' + address,
    qs: params
  }
  return rp(options)
}

export const SET_TOKEN = (data, params) => {
  const options = {
    method: 'GET',
    json: true,
    uri: 'https://amhora.com/_ws/secret',
    qs: params
  }
  return rp(options)
}
export const GET_ADDRESS_INFORMATION = ({ crypto, hash }) => {
  const options = {
    method: 'GET',
    json: true,
    uri: config.apiServer + crypto + '/address/' + hash
  }
  return rp(options)
}

export const GET_ADDRESS_TRANSACTIONS_INFORMATION = ({ crypto, hash }, params = {}) => {
  if (!params.order) {
    params.order = 'desc'
  }
  const options = {
    method: 'GET',
    json: true,
    uri: config.apiServer + crypto + '/address/' + hash + '/transactions',
    qs: params
  }
  return rp(options)
}

export const GET_ADDRESS_MEMPOOL_TRANSACTIONS_INFORMATION = ({ crypto, hash }, params = {}) => {
  const options = {
    method: 'GET',
    json: true,
    uri: config.apiServer + crypto + '/mempool/address/' + hash + '?order=desc',
    qs: params
  }
  return rp(options)
}

export const GET_ADDRESS_TRANSACTIONS_INFORMATION_LATEST = (data, params) => {
  const options = {
    method: 'GET',
    json: true,
    uri: config.apiServer + 'currencies/' + data.currency + '/addresses/' + data.address + '/transactions/latest',
    qs: params
  }
  return rp(options)
}

export const GET_TRANSACTION = ({ crypto, hash }) => {
  const options = {
    method: 'GET',
    json: true,
    uri: config.apiServer + crypto + '/transaction/' + hash
  }
  return rp(options)
}

export const GET_BLOCK = ({ crypto, hash }, params) => {
  const options = {
    method: 'GET',
    json: true,
    uri: config.apiServer + crypto + '/block/' + hash + '/header',
    qs: params
  }
  return rp(options)
}

export const GET_MEMPOOL = ({ crypto, hash }, params) => {
  const options = {
    method: 'GET',
    json: true,
    uri: config.apiServer + crypto + '/mempool/' + hash,
    qs: params
  }
  return rp(options)
}

export const GET_BLOCK_WITH_TRANSACTIONS = ({ crypto, hash }, params) => {
  const options = {
    method: 'GET',
    json: true,
    uri: config.apiServer + crypto + '/block/' + hash + '/transactions',
    qs: params
  }
  return rp(options)
}

export const GET_IS_BLOCK_TRANSACTION = (data) => {
  const options = {
    method: 'GET',
    json: true,
    uri: config.apiServer + 'currencies/' + data.currency + '/hashes/' + data.hash
  }
  return rp(options)
}

export const GET_GLOBAL_RATE_MARKET_GLOBAL = (currency) => {
  const options = {
    method: 'GET',
    json: true,
    uri: config.apiServer + 'rates/global?fiat_currency=' + currency
  }
  return rp(options)
}

export const GET_GLOBAL_RATE_MARKET = () => {
  const options = {
    method: 'GET',
    json: true,
    // uri: config.apiServer + 'rates/exchanges'
    uri: config.apiServer + 'rates/statistics/rates/exchangers'

  }
  return rp(options)
}

export const GET_INITIAL_PULL_TRANSACTION = ({ event, channel }) => {
  const options = {
    method: 'GET',
    json: true,
    uri: config.wsServer + 'events' + `?event=${event}&channel=${channel}`
  }
  return rp(options)
}

export const GET_INITIAL_GLOBAL_STATISTIC = (crypto) => {
  const options = {
    method: 'GET',
    json: true,
    uri: config.apiServer + 'currencies/' + crypto + '/statistics'
  }
  return rp(options)
}

export const GET_BLOCKS_HISTORY = (crypto, params) => {
  const options = {
    method: 'GET',
    json: true,
    uri: config.apiServer + crypto + '/explorer/blocks',
    qs: params
  }
  return rp(options)
}

export const GET_MEMORY_POOL = (crypto, params, page) => {
  const options = {
    method: 'GET',
    json: true,
    uri: config.apiServer + crypto + '/mempool' + `?page=${page}` + `&order=desc`,
    qs: params
  }
  return rp(options)
}

export const GET_CHART_HISTORY = (params) => {
  const options = {
    method: 'GET',
    json: true,
    // uri: config.apiServer + 'rates/chart-data',
    uri: config.apiServer + 'rates/statistics/rates/chart-data',
    qs: params
  }
  return rp(options)
}

export const GET_LAST_CHANNEL_MESSAGE = (params) => {
  const options = {
    method: 'GET',
    json: true,
    uri: config.wsServer + 'events',
    qs: params
  }
  return rp(options)
}

export const GET_STATISTIC_HISTORY = (params) => {
  const options = {
    method: 'GET',
    json: true,
    uri: config.apiServer + 'rates/statistics/history?timestamp=' + params,
    qs: params
  }
  return rp(options)
}

export const GET_CONTENT_FOR_SHORT_INFO_MARKET = (params) => {
  const options = {
    method: 'GET',
    json: true,
    uri: config.apiServer + 'rates/statistics/rates/market',
    qs: params
  }
  return rp(options)
}
export const GET_TRANSACTION_SCRIPT = ({ crypto, hash }) => {
  const options = {
    method: 'GET',
    json: true,
    uri: config.apiServer + crypto + '/transaction/' + hash + '/scripts'
  }
  return rp(options)
}

export const GET_MEMPOOL_SCRIPT = ({ crypto, hash }) => {
  const options = {
    method: 'GET',
    json: true,
    uri: config.apiServer + crypto + '/mempool/' + hash + '/scripts'
  }
  return rp(options)
}

export const GET_MEMPOOL_ALLTRANSACTION_COUNT = (crypto) => {
  const options = {
    method: 'GET',
    json: true,
    uri: config.apiServer + crypto + '/mempool/count'
  }
  return rp(options)
}

export const GET_ALL_MEMPOOL_COUNT = ({ crypto, hash }) => {
  const options = {
    method: 'GET',
    json: true,
    uri: config.apiServer + crypto + '/mempool/address/' + hash + '/count'
  }
  return rp(options)
}

export const GET_LAST_TRANSACTION = ({ crypto, hash }) => {
  const options = {
    method: 'GET',
    json: true,
    uri: config.apiServer + crypto + '/address/' + hash + '/last'
  }
  return rp(options)
}
