<template>
  <div class="line-rate">
    <div class="left-info">
      <currencyes-svgs class="left-info-icons" :currency="rate.nameCurrency"></currencyes-svgs>
      <div class="left-info-currancy">{{rate.nameCurrency}}</div>
      <div class="left-info-currancy-rate">{{rate.rate.toFixed(2)}}</div>
      <div class="left-info-currancy-procent-wrapper"><span :class="['left-info-currancy-procent', {active: +procent > 0}]">{{procent}}</span></div>

    </div>
  </div>
</template>
<script>
import CurrencyesSvgs from './commonUI/CurrencyesSvgs'

export default {
  props: ['rate', 'history'],
  name: 'LineRate',
  components: { CurrencyesSvgs },
  data () {
    return {
      timeOut: '',
      interval: '',
      gray: false,
      status: {
        old: false,
        new: false
      }
    }
  },
  computed: {
    crypto () {
      return this.$store.state.currencyButtons
    },
    fiat () {
      return this.$store.getters.fiat
    },
    procent () {
      if (this.history.length) {
        const difference = this.rate.rate - this.history[0]
        return (difference / this.rate.rate * 100).toFixed(2)
      }
      return 0
    }
  },
  watch: {},
  beforeUpdate: function () {
    this.status.new = this.rate.rate
    this.status.old = this.status.new
  },
  updated () {
  },
  created: function () {
    this.status.new = this.rate.rate
  }
}
</script>
