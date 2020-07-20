<template>
  <div class="market-chart-component">
     <vue-headful
        :title="title"
        :description="description"
      />
    <template v-if="rateHistory.length > 1">
      <LineChart
        :data="[...rateHistory]"
        xAxexField="createdAt"
        yAxexField="value"
        :range="chartRange"
        :tooltipParse="parseTooltip"
      />
    </template>
    <template v-else>
      <template v-if="loading">
        <MoonLoader
          color='#b0becb'
        />
      </template>
      <template v-else>
        {{$t('error_msg.chart_data_not_found')}}
      </template>
    </template>
  </div>
</template>

<script>
import LineChart from '../commonUI/LineChart'
import { GET_CHART_HISTORY } from '../../services/requests'
import MoonLoader from 'vue-spinner/src/MoonLoader'
import { mapGetters } from 'vuex'
import { COINS_NAMES } from '../../constants/coinsMap'

export default {
  name: 'MarketChart',
  components: { MoonLoader, LineChart },
  props: {
    range: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      loading: false,
      rateHistory: [],
      chartRange: this.range,
      periodInfo: ''
    }
  },
  methods: {
    setPeriodInfo () {
      switch (this.range) {
        case ('market_short_info.hour'): this.periodInfo = '1h'
          break
        case ('market_short_info.week'): this.periodInfo = '1w'
          break
        default: this.periodInfo = '24h'
          break
      }
    },
    getHistory () {
      this.setPeriodInfo()
      this.loading = true
      GET_CHART_HISTORY({
        'range': this.periodInfo,
        'exchange': this.market,
        'coin': this.crypto.toUpperCase(),
        'fiat': this.market === 'binance' ? this.fiat + 'T' : this.fiat
      })
        .then(resp => {
          this.rateHistory = resp.rates
          this.chartRange = this.range
          this.loading = false
          this.$emit('get-data', {
            rateHistory: this.rateHistory,
            percentage: resp.percentage,
            chart_height: resp.chart_height,
            chart_low: resp.chart_low,
            average_price: resp.average_price
          })
        })
        .catch((e) => {
          this.loading = false
          console.log(e)
        })
    }
  },
  computed: {
    ...mapGetters({
      market: 'marcet',
      crypto: 'crypto',
      fiat: 'fiat'
    }),
    parseTooltip () {
      if (this.periodInfo === '24h') {
        return '%I %p %d %b'
      }
      if (this.periodInfo === '1h') {
        return '%I:%M %p %d %b'
      }
      return '%d %b \'%y'
    },
    title () {
      return `${this.crypto.toUpperCase() === 'DSH' ? 'DASH' : this.crypto.toUpperCase()} Market`
    },
    description () {
      return `View current rates, market analytics, and exchange data from several sources for ${COINS_NAMES[this.crypto.toUpperCase()]} (${this.crypto.toUpperCase()})`
    }
  },
  watch: {
    crypto () {
      this.getHistory()
    },
    fiat () {
      this.getHistory()
    },
    market () {
      this.getHistory()
    },
    range () {
      this.getHistory()
    }
  },
  mounted () {
    this.getHistory()
  }
}
</script>
<style>
  .market-chart-component{
    display: flex;
    width: 100%;
    height: 205px;
    justify-content: center;
    align-items: center;
    background-color: transparent;
    margin: 40px 0 20px 0;
  }
</style>
