<template>
  <div
    class="market-trades">
    <div class="market-trade">
      <h3 class="market-trade-title">{{$t('market_trades.trades')}}</h3>
      <div v-show="pairMatches">
        <MarketTradesTable
          v-if="this.$store.getters['getCentrifugeConnection']"
          :data="liveTrades"
        />
      </div>
      <div v-show="!pairMatches">
        {{$t('market_trades.not_found')}}
      </div>
    </div>
    <div class="market-trade">
      <h3 class="market-trade-title">{{$t('market_trades.market_live_order_book_bids')}}</h3>
      <div v-show="pairMatches">
        <MarketLiveOrderTable
          v-if="this.$store.getters['getCentrifugeConnection']"
          :data="leaverOrderBookBids"
        />
      </div>
      <div class="market-trade-title_ask" v-show="pairMatches">
        <MarketLiveOrderTable
          v-if="this.$store.getters['getCentrifugeConnection']"
          :data="leaverOrderBookAsk"
        />
      </div>
      <div v-show="!pairMatches">
        Live Order Book data not found
      </div>
    </div>
  </div>
</template>

<script>
import MarketLiveOrderTable from './MarketLiveOrderTable'
import MarketTradesTable from './MarketTradesTable'
import { GET_LAST_CHANNEL_MESSAGE } from '@/services/requests'
import { mapGetters } from 'vuex'

export default {
  name: 'MarketTrades',
  components: { MarketTradesTable, MarketLiveOrderTable },
  props: {
    pairMatches: {
      type: Boolean
    }
  },
  data () {
    return {
      activeLink: '',
      initialActiveLink: '',
      liveTrades: [],
      leaverOrderBookBids: [],
      leaverOrderBookAsk: [],
      activeConnections: [],
      awaitData: false,
      subscription: '',
      subscription2: '',
      subscription3: ''
    }
  },
  computed: mapGetters({
    market: 'marcet',
    crypto: 'crypto',
    fiat: 'fiat'
  }),
  methods: {
    async getInitialState () {
      try {
        if (this.market === 'binance') {
          this.initialActiveLink = this.crypto.toLowerCase() + '_' + this.fiat.toLowerCase() + 't'
        } else {
          this.initialActiveLink = this.crypto.toLowerCase() + '_' + this.fiat.toLowerCase()
        }
        let res = (await GET_LAST_CHANNEL_MESSAGE({
          event: this.market,
          channel: 'market_trades_' + this.initialActiveLink
        })).data
        this.liveTrades = await res.reverse().splice(0, 12)
        this.$emit('getCurrentPrice', this.liveTrades[0].price)

        let orderBookBids = (await GET_LAST_CHANNEL_MESSAGE({
          event: this.market,
          channel: 'market_live_order_book_bids_' + this.initialActiveLink
        })).data
        this.leaverOrderBookBids = orderBookBids[0]
        this.leaverOrderBookBids.data = this.leaverOrderBookBids.data.splice(0, 5)

        let orderBookAsk = (await GET_LAST_CHANNEL_MESSAGE({
          event: this.market,
          channel: 'market_live_order_book_ask_' + this.initialActiveLink
        })).data
        this.leaverOrderBookAsk = orderBookAsk[0]
        this.leaverOrderBookAsk.data = this.leaverOrderBookAsk.data.splice(0, 5)
      } catch (e) {
        console.error(e.message)
      }
    },
    liveTradesHandler (res) {
      this.$emit('getCurrentPrice', res.data[this.market].price)
      if (this.liveTrades.length === 12) {
        this.liveTrades.pop()
      }
      this.liveTrades.unshift(res.data[this.market])
    },
    orderBookHandlerBids (res) {
      Object.keys(res.data).map(item => {
        if (item === this.market) {
          this.leaverOrderBookBids = res.data[this.market]
          this.leaverOrderBookBids.data = this.leaverOrderBookBids.data.splice(0, 5)
        }
      })
    },
    orderBookHandlerAsk (res) {
      Object.keys(res.data).map(item => {
        if (item === this.market) {
          this.leaverOrderBookAsk = res.data[this.market]
          this.leaverOrderBookAsk.data = this.leaverOrderBookAsk.data.splice(0, 5)
        }
      })
    },
    connectToChanel () {
      this.getInitialState()
      let connection = this.$store.getters['getCentrifugeConnection']
      if (this.market === 'binance') {
        this.activeLink = this.crypto.toLowerCase() + '_' + this.fiat.toLowerCase() + 't'
      } else {
        this.activeLink = this.crypto.toLowerCase() + '_' + this.fiat.toLowerCase()
      }
      let haveConnection = false
      this.activeConnections.map((item) => {
        if (item.fiat === this.fiat && item.crypto === this.crypto && item.market === this.market) haveConnection = true
      })
      if (haveConnection) {
        this.subscription = connection.subscribe('market_live_order_book_bids_' + this.activeLink + '_' + this.market, () => {})
        this.subscription2 = connection.subscribe('market_live_order_book_ask_' + this.activeLink + '_' + this.market, () => {})
        this.subscription3 = connection.subscribe('market_trades_' + this.activeLink + '_' + this.market, () => {})
      } else {
        this.subscription = connection.subscribe('market_live_order_book_bids_' + this.activeLink + '_' + this.market, this.orderBookHandlerBids)
        this.subscription2 = connection.subscribe('market_live_order_book_ask_' + this.activeLink + '_' + this.market, this.orderBookHandlerAsk)
        this.subscription3 = connection.subscribe('market_trades_' + this.activeLink + '_' + this.market, this.liveTradesHandler)
        this.activeConnections.push({ fiat: this.fiat, crypto: this.crypto, market: this.market })
      }
    },
    disconnectFromChanel () {
      this.subscription.unsubscribe('market_live_order_book_bids_' + this.activeLink + '_' + this.market, () => {})
      this.subscription2.unsubscribe('market_live_order_book_ask_' + this.activeLink + '_' + this.market, () => {})
      this.subscription3.unsubscribe('market_trades_' + this.activeLink + '_' + this.market, () => {})
    }
  },
  watch: {
    market () {
      this.disconnectFromChanel()
      this.connectToChanel()
    },
    crypto () {
      this.disconnectFromChanel()
      this.connectToChanel()
    },
    fiat () {
      this.disconnectFromChanel()
      this.connectToChanel()
    }
  },
  mounted () {
    this.connectToChanel()
  },
  beforeDestroy () {
    this.disconnectFromChanel()
  }
}
</script>
<style lang="scss" scoped>
  .market-trades {
    display: flex;
    justify-content: space-between;
  }

  .market-trade {
    width: calc(50% - 18px);
  }

  .market-trade-title_ask {
    padding-top: 33px;
  }

  .market-trade-title {
    color: #41464a;
    font-size: 18px;
    font-weight: 500;
  }
</style>
