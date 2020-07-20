<template>
  <transition name="fade">
    <div class="rates-info">
      <div class="rates-info_title">
        <h3 class="right-panel-title">{{$t('market_short_info.market')}}</h3>
        <div class="d-flex">
        <span>{{$t('global.range')}}</span>
          <SmallSelect
            :items="rangeVariables"
            :value="range"
            @onSelect="changeRange"
          />
        </div>
      </div>
      <div v-if="!loading" class="dflex-column">
        <MarketShortInfoLine
          v-for="(item, key, i) of periodInfo"
          :currencyInfo="item"
          :fiat="fiat"
          :range="range"
          :name="Object.keys(periodInfo)[i]"
          :key="i"
          :class="`order-${Object.keys(periodInfo)[i]}`"
        />
      </div>
      <div v-else class="spinner-wrapper">
        <MoonLoader
          color="#b0becb"
          size="50px"
        />
      </div>
    </div>
  </transition>
</template>
<script>
import MarketShortInfoLine from './MarketShortInfoLine'
import SmallSelect from './commonUI/SmallSelect'
import MoonLoader from 'vue-spinner/src/MoonLoader'
import { mapGetters } from 'vuex'
import { GET_LAST_CHANNEL_MESSAGE } from '@/services/requests'
export default {
  name: 'MarkesShortInfo',
  components: { MoonLoader, SmallSelect, MarketShortInfoLine },
  data () {
    return {
      range: 'market_short_info.hour',
      rangeVariables: ['market_short_info.day', 'market_short_info.hour', 'market_short_info.week'],
      infoForMarkets: [],
      periodInfo: [],
      loading: false,
      subscription:'',
    }
  },
  computed: mapGetters({
    fiat: 'fiat'
  }),
  watch: {
    fiat () {
      this.getInfo()
      this.connectToSocket()
    }
  },
  methods: {
    async getInfo () {
      this.loading = true
      this.infoForMarkets = (await GET_LAST_CHANNEL_MESSAGE({ event: this.fiat, channel: 'rates_global' })).data[0]
      this.loading = false
      this.setPeriodInfo()
    },
    updateInfoMarket (data) {
      this.infoForMarkets = data.data[this.fiat]
      this.setPeriodInfo()
    },
    connectToSocket () {
      let connection = this.$store.getters['getCentrifugeConnection']
      connection.subscribe('rates_global_' + this.fiat.toLowerCase(), this.updateInfoMarket)
    },
    setPeriodInfo () {
      switch (this.range) {
        case ('market_short_info.hour'): this.periodInfo = this.infoForMarkets.hour
          break
        case ('market_short_info.week'): this.periodInfo = this.infoForMarkets.week
          break
        default: this.periodInfo = this.infoForMarkets.day
          break
      }
    },
    changeRange (val) {
      this.range = val
      this.setPeriodInfo()
    }
  },
  mounted () {
    this.connectToSocket()
    this.getInfo()
  }
}
</script>

<style scoped>
  .rates-info_title{
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 27px;
  }
  .right-panel-title{
    margin-bottom: 0;
  }
  .spinner-wrapper{
    height: 100px;
  }
  .d-flex{
    display: flex;
    align-items: center;
  }
  .d-flex span{
    margin-right: 5px;
    color: #41464a50;
  }
  .dflex-column{
    display: flex;
    flex-direction: column;
  }
  .order-BTC {
    order: 1;
  }
  .order-BCH {
    order: 2;
  }
  .order-DSH {
    order: 3;
  }
  .order-XMR {
    order: 4;
  }
  .order-ETH {
    order: 5;
  }
  .order-LTC {
    order: 6;
  }
</style>
