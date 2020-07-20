const RATE_DEFAULT = {
  BCH: 0,
  BTC: 0,
  DSH: 0,
  ETH: 0,
  LTC: 0,
  XMR: 0
}
let initialState = {
  'version': '0.0.24',
  'language': null,
  'fiat': 'USD',
  'fiats': [
    {
      name: 'USD',
      full_name: 'United States Dollar',
      symbol: '$'
    },
    {
      name: 'EUR',
      full_name: 'Euro',
      symbol: '€'
    },
    {
      name: 'GBP',
      full_name: 'Great Britain Pounds',
      symbol: '£'
    }
  ],
  'crypto': 'BTC',
  'rate': {},
  'error': {
    'msg': '',
    'url': ''
  },
  'currencyButtons': [
    {
      name: 'BTC',
      full_name: 'Bitcoin'
    },
    {
      name: 'BCH',
      full_name: 'Bitcoin cash'
    },
    {
      name: 'DSH',
      full_name: 'Dash'
    },
    {
      name: 'XMR',
      full_name: 'Monero'
    },
    {
      name: 'ETH',
      full_name: 'Ethereum'
    },
    {
      name: 'LTC',
      full_name: 'Litecoin'
    }
  ],
  'marcet': 'bitstamp',
  'lastExchangeResponse': {
    bitstamp: 0,
    bitfinex: 0,
    coinbase: 0,
    okcoin: 0,
    kraken: 0,
    binance: 0,
    cex: 0,
    gemini: 0
  },
  'infoForMarket': {
    global: [],
    okcoin: [],
    coinbase: [],
    bitstamp: [],
    bitfinex: [],
    kraken: [],
    binance: [],
    cex: [],
    gemini: []
  },
  rates: {
    'USD': [
      {
        rate: RATE_DEFAULT
      }
    ],
    'EUR': [
      {
        rate: RATE_DEFAULT
      }
    ],
    'GBP': [
      {
        rate: RATE_DEFAULT
      }
    ]
  },
  statistic: {
    loading: false,
    data: {}
  },
  centrifugeConnection:'',
  disableCryptoFiatPair: false,
  statisticActiveDate: new Date(Date.now() - 24 * 3600 * 1000)
}

export const state = initialState
