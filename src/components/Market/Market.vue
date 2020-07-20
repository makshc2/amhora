<template>
  <div class="middle-part">
    <vue-headful
        :title="title"
        :description="description"
      />
    <div class="content-title">
      <currency-buttons prefix="/market/"></currency-buttons>
    </div>
    <div class="container">
      <div class="settings-wrapper">
        <market-buttons/>
        <div class="d-flex">
          <span>{{$t('global.range')}}</span>
          <SmallSelect
            :items="rangeVariables"
            :value="range"
            @onSelect="changeRange"
          />
        </div>
      </div>
    </div>
    <div class="container_market-chart">
      <MarketChart
        :range="this.range"
        @get-data="val => chartData = val"
      />
    </div>
    <div class="container">
      <MarketCoinInfo
        :range="range"
        :percentage="chartData.percentage"
        :averagePrice="chartData.average_price"
        :chartData="{height: chartData.chart_height, low: chartData.chart_low}"
        :lastPrice = "lastPrice"
      />
    </div>
    <div class="border-top-wrapper">
      <div class="container">
        <MarketTrades
          v-if="$store.getters['getCentrifugeConnection']"
          :pairMatches="chartData.rateHistory.length > 0"
          @getCurrentPrice="getCurrentPrice"/>
      </div>
    </div>
    <MarketFooter />
  </div>
</template>
<script>
import CurrencyButtons from '../CurrencyButtons.vue'
import MarketCoinInfo from './MarketCoinInfo.vue'
import MarketButtons from './MarketButtons'
import SmallSelect from '../commonUI/SmallSelect'
import MarketChart from './MarketChart'
import MarketTrades from './MarketTrades'
import MarketFooter from './MarketFooter'

export default {
  name: 'Market',
  components: {
    MarketFooter,
    MarketTrades,
    MarketChart,
    SmallSelect,
    MarketButtons,
    CurrencyButtons,
    MarketCoinInfo
  },
  data () {
    return {
      range: 'market_short_info.day',
      rangeVariables: ['market_short_info.day', 'market_short_info.hour', 'market_short_info.week'],
      chartData: { rateHistory: [] },
      lastPrice: 0,
      periodInfo: ''
    }
  },
  methods: {
    changeRange (val) {
      this.range = val
    },
    getCurrentPrice (event) {
      this.lastPrice = event
    }
  },
  computed: {
    infoForMarkets () {
      return this.$store.getters.infoForMarket
    },
    title() {
      return 'Market'
    },
    description() {
      return 'Sample Crypto Markets description'
    }
  },
  created() {

  },
  beforeRouteLeave (to, from, next) {
    this.$store.commit('DISABLE_CRYPTO_FIAT_PAIRS', false)
    return next()
  }
}
</script>
<style scoped>
  .middle-part{
    justify-content: flex-start;
  }

  .settings-wrapper{
    display: flex;
    justify-content: space-between;
  }
  .border-top-wrapper{
    margin-top: 8px;
    padding-top: 10px;
  }
  .d-flex{
    display: flex;
    align-items: center;
  }
  .d-flex span{
    margin-right: 5px;
    color: #41464a50;
  }
</style>
