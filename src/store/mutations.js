import currencies from '../constants/coinsArray'

export const SET_LANGUAGE = (state, language) => {
  state.language = language
}
export const CHANGE_FIAT = (state, fiat) => {
  state.fiat = fiat
}
export const SET_CRYPTO = (state, crypto) => {
  crypto && currencies.includes(crypto.toUpperCase()) ? state.crypto = crypto : state.crypto = 'BTC'
}
export const SET_RATE = (state, { data }) => {
  state.rate = data[0].hour
}
export const SET_ERROR = (state, error) => {
  state.error.msg = error.msg
  state.error.url = error.url
}
export const ADDED_NEW_CRYPTO_BUTTON = (state, currencyButtons) => {
  state.currencyButtons.push(currencyButtons)
}
export const SET_MARKET = (state, market) => {
  state.marcet = market
}
export const ADDED_FIATS = (state, fiats) => {
  state.fiats.push(fiats)
}
export const SET_INFO_FOR_MARKET = (state, infoForMarket) => {
  state.infoForMarket[infoForMarket.name] = infoForMarket.value
}
export const SET_LAST_EXCHANGE_RESPONSE = (state, lastExchangeResponse) => {
  if (lastExchangeResponse.name !== 'global') {
    state.lastExchangeResponse[lastExchangeResponse.name] = lastExchangeResponse.value
  }
}
export const SET_STATISTIC_NEW_DATE = (state, date) => {
  state.statisticActiveDate = date
}
export const CHANGE_RATE = (state, data) => {
  let rates = []
  Object.keys(data).forEach(function (k) {
    rates.push({
      nameCurrency: k,
      rate: data[k],
      isGreen: isGreen(state, k, data[k])
    })
  })

  state.rates[state.fiat] = rates
}

export const SET_STATISTIC = (state, statistic) => {
  if (statistic) {
    state.statistic = { data: { ...statistic }, loading: false }
  }
}

export const SET_STATISTIC_LOADING = (state, value) => {
  if (typeof value === 'boolean') {
    state.statistic.loading = value
  }
}

function isGreen (state, cryptocurrency, rate) {
  let old = state.rates[state.fiat].find(rate => rate.nameCurrency === cryptocurrency)
  if (!old) {
    return true
  }

  if (old.rate === rate) {
    return old.isGreen
  } else {
    return rate > old.rate
  }
}

export const CHANGE_COLOR = (state, name) => {
  for (let item in state.rates[state.fiat]) {
    for (let oldItem in state.rates[state.fiat][item]) {
      if (oldItem === 'nameCurrency') {
        if (state.rates[state.fiat][item][oldItem] === name['name']['nameCurrency']) {
          state.rates[state.fiat][item]['isGreen'] = name['status']
        }
      }
    }
  }
}
export const DISABLE_CRYPTO_FIAT_PAIRS = (state, value) => {
  state.disableCryptoFiatPair = value
}
export const SET_CF_CONNECTION = (state, value) => {
  state.centrifugeConnection = value
}
