<template>
  <div class="markets">
    <button
      v-for="item in buttons" :key="item.name"
      :class="['market-button',
      {'selected-market' : market === item.value},
      {'none-active-market' : (!marketCryptoPairs[crypto.toLowerCase().toLowerCase()][item.name.toLowerCase()] ||
      !pairs[fiat][crypto.toLowerCase()][item.value])}]"
      @click="selectMarket(item.value)"
      :disabled="(!marketCryptoPairs[crypto.toLowerCase()][item.name.toLowerCase()] ||
      !pairs[fiat][crypto.toLowerCase()][item.value])"
    >
      {{item.name}}
    </button>
    <span
      class="ask ask_market"
      v-tooltip.bottom="{content: $t('static_navigation.market_tooltip')}"
    >
      !
    </span>
  </div>
</template>
<script>
import { marketCryptoPairs, cryptoFiatPairs } from '@/mocks/crypto-fiat-pairs'
import { mapGetters } from 'vuex'

export default {
  name: 'MarketButtons',
  data () {
    return {
      marketCryptoPairs: Object.freeze(marketCryptoPairs),
      pairs: Object.freeze(cryptoFiatPairs),
      buttons: {
        bitstamp: {
          name: 'Bitstamp',
          value: 'bitstamp'
        },
        bitfinex: {
          name: 'Bitfinex',
          value: 'bitfinex'
        },
        coinbase: {
          name: 'Coinbase',
          value: 'coinbase'
        },
        okcoin: {
          name: 'OKCoin',
          value: 'okcoin'
        },
        kraken: {
          name: 'Kraken',
          value: 'kraken'
        },
        binance: {
          name: 'Binance',
          value: 'binance'
        },
        cex: {
          name: 'CEX',
          value: 'cex'
        },
        gemini: {
          name: 'Gemini',
          value: 'gemini'
        }
      },
      isLoad: false
    }
  },
  computed: {
    ...mapGetters({
      rate: 'rate',
      fiat: 'fiat',
      currencyButtons: 'currencyButtons',
      market: 'marcet',
      crypto: 'crypto'
    })
  },
  methods: {
    selectMarket (market) {
      this.$store.commit('SET_MARKET', market)
    },
    calculateCryptoPairs () {
      this.calculateFirstMatchPair()
      const markets = this.marketCryptoPairs[this.crypto.toLowerCase()]
      const firstMarket = Object.entries(markets).find(market => market[1])
      if (!markets && firstMarket) {
        return this.$store.commit('SET_MARKET', firstMarket[0])
      }
    },
    calculateFirstMatchPair () {
      const markets = this.pairs[this.fiat][this.crypto.toLowerCase()]
      const firstMarket = Object.entries(markets).find(market => market[1])
      if (firstMarket) {
        return this.$store.commit('SET_MARKET', firstMarket[0])
      }
      this.$store.commit('CHANGE_FIAT', 'USD')
    }
  },
  watch: {
    crypto: { handler: 'calculateCryptoPairs' },
    fiat: { handler: 'calculateFirstMatchPair' }
  },
  created () {
    this.calculateCryptoPairs()
  }
}
</script>
<style scoped lang="scss">
  .market-button{
    color: #41464a;
    font-size: 18px;
    font-weight: 500;
    border: none;
    border-bottom: 2px dotted #41464a80;
    cursor: pointer;
    padding: 2px 0;
    margin-left: 17px;
    background-color: transparent;
    &.selected-market{
      border-bottom: none;
     }
  }
  .none-active-market{
    cursor: not-allowed;
    text-decoration: none;
    opacity: 0.5;
  }
  .markets{
    display: flex;
  }
  .disabled-markets{
    margin-left: 30px;
  }
  .disabled-market{
    cursor: not-allowed;
    border-bottom: none ;
  }
  .ask_market{
    margin-left: 30px;
  }

</style>
