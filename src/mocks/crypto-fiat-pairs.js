export const cryptoFiatPairs = {
  USD: {
    btc: { bitstamp: true, bitfinex: true, coinbase: true, okcoin: true, kraken: true, binance: true, cex: true, gemini: true },
    bch: { bitstamp: true, bitfinex: false, coinbase: true, okcoin: true, kraken: true, binance: false, cex: true, gemini: true },
    dsh: { bitstamp: false, bitfinex: true, coinbase: false, okcoin: false, kraken: true, binance: true, cex: true, gemini: false },
    ltc: { bitstamp: true, bitfinex: true, coinbase: false, okcoin: true, kraken: true, binance: true, cex: true, gemini: true },
    eth: { bitstamp: true, bitfinex: true, coinbase: true, okcoin: true, kraken: true, binance: true, cex: true, gemini: true },
    xmr: { bitstamp: false, bitfinex: true, coinbase: false, okcoin: false, kraken: true, binance: true, cex: false, gemini: false }
  },
  EUR: {
    btc: { bitstamp: true, bitfinex: true, coinbase: true, okcoin: false, kraken: true, binance: false, cex: true, gemini: false },
    bch: { bitstamp: true, bitfinex: false, coinbase: true, okcoin: false, kraken: true, binance: false, cex: true, gemini: false },
    dsh: { bitstamp: false, bitfinex: false, coinbase: false, okcoin: false, kraken: true, binance: false, cex: true, gemini: false },
    ltc: { bitstamp: true, bitfinex: false, coinbase: false, okcoin: false, kraken: true, binance: false, cex: false, gemini: false },
    eth: { bitstamp: true, bitfinex: true, coinbase: true, okcoin: false, kraken: true, binance: false, cex: true, gemini: false },
    xmr: { bitstamp: false, bitfinex: false, coinbase: false, okcoin: false, kraken: true, binance: false, cex: false, gemini: false }
  },
  GBP: {
    btc: { bitstamp: true, bitfinex: true, coinbase: true, okcoin: false, kraken: true, binance: false, cex: true, gemini: false },
    bch: { bitstamp: false, bitfinex: false, coinbase: false, okcoin: false, kraken: false, binance: false, cex: true, gemini: false },
    dsh: { bitstamp: false, bitfinex: false, coinbase: false, okcoin: false, kraken: false, binance: false, cex: true, gemini: false },
    ltc: { bitstamp: false, bitfinex: false, coinbase: false, okcoin: false, kraken: false, binance: false, cex: false, gemini: false },
    eth: { bitstamp: false, bitfinex: true, coinbase: false, okcoin: false, kraken: true, binance: false, cex: true, gemini: false },
    xmr: { bitstamp: false, bitfinex: false, coinbase: false, okcoin: false, kraken: false, binance: false, cex: false, gemini: false }
  }
}
export const calculateCryptoFiatPairs = {
  BTC: { USD: true, EUR: true, GBP: true },
  BCH: { USD: true, EUR: true, GBP: false },
  DSH: { USD: true, EUR: false, GBP: false },
  XMR: { USD: true, EUR: false, GBP: false },
  ETH: { USD: true, EUR: true, GBP: true },
  LTC: { USD: true, EUR: true, GBP: false }
}

export const marketCryptoPairs = {
  btc: { bitstamp: true, bitfinex: true, coinbase: true, okcoin: true, kraken: true, binance: true, cex: true, gemini: true },
  bch: { bitstamp: true, bitfinex: false, coinbase: true, okcoin: true, kraken: true, binance: false, cex: true, gemini: true },
  dsh: { bitstamp: false, bitfinex: true, coinbase: false, okcoin: false, kraken: true, binance: true, cex: true, gemini: false },
  ltc: { bitstamp: true, bitfinex: true, coinbase: false, okcoin: true, kraken: true, binance: true, cex: true, gemini: true },
  eth: { bitstamp: true, bitfinex: true, coinbase: true, okcoin: true, kraken: true, binance: true, cex: true, gemini: true },
  xmr: { bitstamp: false, bitfinex: true, coinbase: false, okcoin: false, kraken: true, binance: true, cex: false, gemini: false }
}
