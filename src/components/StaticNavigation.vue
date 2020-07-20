<template>
  <div class="static-navigation">
    <LeftNavigation/>
    <transition name="fade" mode="out-in">
      <router-view/>
    </transition>
    <RightNavigation v-if="this.$store.getters['getCentrifugeConnection']"/>
  </div>
</template>

<script>
  import getGlobalRateMixin from '../mixins/getGlobalRateMixin'
  import {ADDED_FORMAT_MONEY} from '../services/util'
  import LeftNavigation from './LeftNavigation'
  import RightNavigation from './RightNavigation'

  export default {
    name: 'StaticNavigation',
    components: {
      RightNavigation,
      LeftNavigation
    },
    data() {
      return {
        subscription: '',
        subscription2: '',
      }
    },
    mixins: [getGlobalRateMixin],
    computed: {
      infoForMarket() {
        return this.$store.getters.infoForMarket
      },
      currencyButtons() {
        return this.$store.getters.currencyButtons
      },
      fiats() {
        return this.$store.getters.fiats
      },
      fiat() {
        return this.$store.getters.fiat
      },
      crypto() {
        return this.$store.getters.crypto
      }
    },

    methods: {
      getCurrency() {
        this.$store.dispatch('GET_CURRENCY')
          .catch(() => {
            this.$router.push('/error')
          })
      },
      getCarrencyFiat() {
        this.$store.dispatch('GET_CURRENCY_FIAT')
          .catch(() => {
            this.$router.push('/error')
          })
      },
      getMarketRate() {
        this.$store.dispatch('GET_MARKET_RATE')
          .catch(() => {
            this.$router.push('/error')
          })
      },
      getGlobalRate() {
        this.$store.dispatch('GET_GLOBAL_RATE')
          .catch(() => {
            this.$router.push('/error')
          })
      },
      globalRateHandler({event, data}) {
        this.$store.commit('SET_LAST_EXCHANGE_RESPONSE', {name: 'global', value: +new Date()})
        this.$store.dispatch('SET_INFO_FOR_MARKET', {name: 'global', value: data[event]})
      },
      ratesByExchangeHandler({event, data}) {
        if (data[event].from && data[event].to) {
          this.$store.commit('SET_LAST_EXCHANGE_RESPONSE', {name: event, value: +new Date()})
          this.$store.dispatch('SET_INFO_FOR_MARKET', {name: event, value: data[event]})
        }
      },
      statisticConnectCF() {
        let connection = this.$store.getters['getCentrifugeConnection']
        this.subscription = connection.subscribe('global_rates', this.globalRateHandler)
        this.subscription2 = connection.subscribe('rates_by_exchange', this.ratesByExchangeHandler)
      },
      statisticDisconnectCF() {
        this.subscription.unsubscribe('global_rates', this.globalRateHandler)
        this.subscription2.unsubscribe('rates_by_exchange', this.ratesByExchangeHandler)
      }
    },

    watch: {
      '$route.params.currency'() {
        if (this.$route.params.currency) {
          this.$store.commit('SET_CRYPTO', this.$route.params.currency)
        }
      },
      fiat() {
        // this.getGlobalRate()
      }
    },
    created() {
      ADDED_FORMAT_MONEY()
    },
    mounted() {
      this.statisticConnectCF()
    },
    beforeDestroy() {
      this.statisticDisconnectCF()
    }
  }
</script>

<style scoped lang="scss">
  .static-navigation {
    width: 100%;
    min-height: 100%;
    display: flex;
    justify-content: space-between;
  }
</style>
