<template>
  <div class="right-buttons">
    <h3 class="right-buttons-title">
      {{$t('right_buttons.preferable_currency')}}
    </h3>
      <div class='right-buttons-items'>
        <button v-for="item in fiats" :key="item.name"
                :class="['right-buttons-item', {active: item.name === fiat}]"
                @click="selectFiat(item.name)"
        >
          {{item.name}}
        </button>
      </div>
  </div>
</template>
<script>
import moment from 'moment'
import apiUrls from '@/services/api-urls'

export default {
  name: 'RightButtons',
  components: {},
  data () {
    return {
      fiatButtons: [],
      allFiat: [],
      isSelectOpen: false
    }
  },
  computed: {
    fiat () {
      return this.$store.getters.fiat
    },
    market () {
      return this.$store.getters.marcet
    },
    crypto () {
      return this.$store.getters.crypto.toLowerCase()
    },
    fiats () {
      return this.$store.getters.fiats
    }
  },
  methods: {
    selectFiat (fiat) {
      if (fiat !== this.fiat) {
        this.$store.commit('CHANGE_FIAT', fiat)
        this.$store.dispatch('GET_RATES', { event: fiat, channel: 'rates_global' })
        this.subscribeUnsubscribeRatesGlobal()
      }
    },
    setRate ({ data }) {
      this.$store.commit('SET_RATE', { data: [data[this.fiat]] })
    },
    subscribeUnsubscribeRatesGlobal () {
      let connection = this.$store.getters['getCentrifugeConnection']
      connection.subscribe('rates_global_' + this.fiat.toLowerCase())
    }
  },
  mounted () {
    this.subscribeUnsubscribeRatesGlobal()
  }
}
</script>
