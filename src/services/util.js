import store from '../store'

function toXMR (to) {
  return (+to * 0.000000000001).toFixed(12)
}

export const INIT_LOCAL = (language) => {
  let haveLanguages = [
    'ru',
    'en',
    'uk'
  ]
  if (language !== undefined) {
    store.commit('SET_LANGUAGE', language)
    return language
  } else {
    if (store.state.language === null) {
      let languageInBrowser = (navigator.language || navigator.browserLanguage).substring(0, 2)
      if (haveLanguages.indexOf(language) === -1) {
        store.commit('SET_LANGUAGE', 'en')
        return 'en'
      } else {
        store.commit('SET_LANGUAGE', languageInBrowser)
        return languageInBrowser
      }
    } else {
      return store.state.language
    }
  }
}

export const PARS_ETH_TRANSACTIONS = (transaction, address, noAddressText, isThatBlock) => {
  let parsedTransaction = {
    hash: transaction.hash,
    input: [{
      address: transaction.vin.hash,
      isContract: transaction.vout.isContract
    }],
    output: [{
      address: transaction.vout.hash,
      value: +transaction.vout.value,
      isContract: transaction.vout.isContract
    }],
    amount: +transaction.value,
    confirmations: transaction.confirmations ? transaction.confirmations : null,
    outcoming: isThatBlock === true ? 'noAddress' : transaction.from === address ? 'outcoming' : 'coming',
    date: transaction.timestamp === undefined ? null : transaction.timestamp,
    originalValue: transaction.original_value,
    fees: (+transaction.fee).toFixed(12),
    feesSatB: (+transaction.gasPrice * +transaction.gas).toFixed(12),
    blockheight: transaction.blockNumber,
    size: null,
    gas: transaction.gas,
    gasPrice: transaction.gasPrice
  }
  parsedTransaction['isOpen'] = false
  parsedTransaction['current_value_button'] = false

  return parsedTransaction
}

export const PARS_XMR_TRANSACTIONS = (transaction, address, noAddressText) => {
  let parsedTransaction = {
    hash: transaction.hash,
    input: [],
    output: [],
    amount: 0,
    confirmations: transaction.confirmations,
    outcoming: 'noAddress',
    date: transaction.timestamp,
    originalValue: null,
    fees: transaction.fees !== undefined ? transaction.fees : 0,
    feesSatB: transaction.fees !== undefined ? ((+transaction.fees / +transaction.size).toFixed(8)) + ' sat/B' : null,
    blockheight: transaction.block_height,
    size: transaction.size !== undefined ? transaction.size + ' BYTE' : null,
    locktime: transaction.locktime !== undefined ? transaction.locktime : null
  }
  transaction.vin.forEach(() => {
    parsedTransaction.input.push({ addr: noAddressText })
  })
  transaction.vout.forEach(element => {
    parsedTransaction.amount = +parsedTransaction.amount + +toXMR(+element.amount)
    parsedTransaction.output.push({
      scriptPubKey: {
        addresses: element.target.key
      },
      value: toXMR(+element.amount)
    })
  })
  parsedTransaction['isOpen'] = false
  parsedTransaction['current_value_button'] = false

  return parsedTransaction
}

export const HANDLING_ERROR = (error, errorTxt) => {
  if (error.error && error.error.message !== 'Failed to fetch') {
    if (error.statusCode === 502) {
      return errorTxt(error.error.msg)
    }
    if (error.statusCode !== 500) {
      return errorTxt('error_msg.' + error.error.code)
    } else {
      return errorTxt('error_msg.error_rpc')
    }
  } else {
    return errorTxt('error_msg.service_unavailable')
  }
}

export const ADDED_FORMAT_MONEY = () => {
  /* eslint-disable no-extend-native */
  Number.prototype.formatMoney = function (c, d, t) {
    c = isNaN(c = Math.abs(c)) ? 2 : c
    d = d === undefined ? '.' : d
    t = t === undefined ? ',' : t
    let n = this
    const s = n < 0 ? '-' : ''
    const i = String(parseInt(n = Math.abs(Number(n) || 0).toFixed(c)))
    let j = i.length > 3 ? i.length % 3 : 0
    return s + (j ? i.substr(0, j) + t : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : '')
    /* eslint-enable no-extend-native */
  }
}
