<template>
  <div class="content-footer container">
    <div class="general-statistics">
      <div class="general-statistics-hint">
        <img src="@/assets/resources/icons/spinner.svg" alt="spinner">

        <span>
        {{$t('general_statistics.displaying_real_time_transactions')}}...
      </span>
      </div>
      <div class="general-statistics-items">
        <div
          class="general-statistics-item"
        >
          <img src="@/assets/resources//icons/arrows.svg" alt="arrows">
          <span v-tooltip.hover="$t('general_statistics.total_unconfirmed')">
            {{footerData.total_transactions}}
          </span>
        </div>
        <div
          class="general-statistics-item"
          v-tooltip.hover="$t('general_statistics.average_transaction')"
        >
          <img src="@/assets/resources//icons/rings.svg" alt="rings">{{footerData.fee}}
        </div>
        <div
          class="general-statistics-item"
          v-tooltip.hover="$t('general_statistics.transactions_per')"
        >
          <img src="@/assets/resources//icons/clocks.svg" alt="clocks">{{footerData.txs_per_sec}}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { GET_INITIAL_PULL_TRANSACTION } from '../services/requests'
import { mapGetters } from 'vuex'

export default {
  name: 'GeneralStatistics',
  data () {
    return {
      poolStatistic: {},
      subscription:'',
    }
  },
  computed: {
    footerData () {
      if (this.poolStatistic[this.crypto]) {
        return {
          fee: this.crypto === 'ETH' || this.crypto === 'XMR'
            ? `${this.poolStatistic[this.crypto].fee.toFixed(8)} ${this.crypto}` || 'NA'
            : `${this.poolStatistic[this.crypto].fee.toFixed(8)} ${this.crypto}` || 'NA',
          txs_per_sec: this.poolStatistic[this.crypto].txs_per_sec.toFixed(2) || 'NA',
          total_transactions: this.poolStatistic[this.crypto].total_transactions.toFixed(0) || 'NA'
        }
      }
      return {
        fee: 'NA',
        txs_per_sec: 'NA',
        total_transactions: 'NA'
      }
    },
    ...mapGetters({
      crypto: 'crypto',
      rates: 'rates',
      fiat: 'fiat'
    })
  },

  methods: {
    updatePoolStatistic (crypto, val) {
      this.poolStatistic[crypto] = val
      this.poolStatistic = { ...this.poolStatistic }
    },
    getInitialStatistic (crypto) {
      GET_INITIAL_PULL_TRANSACTION({ event: crypto, channel: 'blockchain_statistic' })
        .then(resp => {
          resp = resp.data[0]
          this.updatePoolStatistic(crypto, resp)
        })
    },
    // statisticHandler ({ event, data }) {
    //   this.updatePoolStatistic(event, data[event])
    // },
    // subscibe () {
    //   let connection = this.$store.getters['getCentrifugeConnection']
    //   this.subscription = connection.subscribe('blockchain_statistic_' + this.crypto.toLowerCase(), this.statisticHandler)
    // },
    // unsubscribe () {
    //   this.subscription.unsubscribe('blockchain_statistic', this.statisticHandler)
    // }
  },
  watch: {
    crypto () {
      this.getInitialStatistic(this.crypto)
      // this.unsubscribe()
      // this.subscibe()
    }
  },
  async mounted () {
    this.getInitialStatistic(this.crypto)
    setInterval(() => {
      this.getInitialStatistic(this.crypto)
    }, 3000)
    // this.subscibe()
  },
  // beforeDestroy () {
  //   this.unsubscribe()
  // }
}

</script>
