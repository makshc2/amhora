<template>
  <div class="middle-buttons">
    <nav class="middle-buttons-list container">
      <router-link
        v-for="item in currencyButtons"
        :key="item.name"
        :to="{ path: prefix +  item.name.toLowerCase()}"
        :class="['middle-button', {'router-link-active' : item.name.toLowerCase() === crypto}]"
      >
        <CurrencyesSvgs :currency="item.name" class="c-icon"></CurrencyesSvgs>
        <span class="c-name">{{item.full_name}}</span>
        <span class="c-val" v-if="awaitData">{{fiatIcon}} {{rates[item.name] && rates[item.name].Value.toFixed(2) || '-'}}</span>
        <span class="c-val" v-else>{{fiatIcon}} - </span>
      </router-link>
    </nav>
  </div>
</template>
<script>
import fiatSignMixin from '../mixins/fiatSignMixin'
import CurrencyesSvgs from './commonUI/CurrencyesSvgs'
import { mapGetters } from 'vuex'
import { GET_LAST_CHANNEL_MESSAGE } from '@/services/requests'
export default {
  name: 'CurrencyButtons',
  data () {
    return {
      rates: '',
      awaitData: false,
      subscription: ''
    }
  },
  components: { CurrencyesSvgs },
  mixins: [fiatSignMixin],
  props: {
    prefix: {
      type: String,
      default: '/'
    }
  },
  computed: {
    ...mapGetters({
      rate: 'rate',
      fiat: 'fiat',
      currencyButtons: 'currencyButtons',
      market: 'marcet',
      crypto: 'crypto',
      needDisable: 'disableCryptoFiatPair'
    })
  },
  methods: {
    getInfo () {
      GET_LAST_CHANNEL_MESSAGE({
        event: this.fiat,
        channel: 'rates_global'
      })
        .then(res => {
          if (res.data) {
            this.rates = res.data[0].fifteenMinutes
            this.awaitData = true
          }
        })
    },
    updateInfoMarket (data) {
      if (data.data) {
        this.rates = data.data[this.fiat].fifteenMinutes
      }
    },

    connectToSocket () {
      let connection = this.$store.getters['getCentrifugeConnection']
      this.subscription = connection.subscribe('rates_global_' + this.fiat.toLowerCase(), this.updateInfoMarket)
    },
    disconnectFromChanel () {
      this.subscription.unsubscribe('rates_global_' + this.fiat.toLowerCase(), () => {})
    }
  },
  watch: {
    fiat () {
      this.getInfo()
      this.disconnectFromChanel()
      this.connectToSocket()
    }
  },
  mounted () {
    this.getInfo()
    this.connectToSocket()
  }
}
</script>
<style scoped>
  .not-active {
    pointer-events: none;
    cursor: default;
    text-decoration: none;
    color: black;
    background: #dddddd;
  }
</style>
