<template>
  <div class="converter">
    <h3 class="right-panel-title">{{$t('converter.exchange_rate')}}
      <span class="ask" v-tooltip.hover="$t('static_navigation.tooltip_converter')">!</span>
    </h3>
    <template v-if="!loading">
      <div class="converter-part top" >
        <ConverterSelect
          :options="cryptos"
          :selected="crypto"
          @onSelect="changeCrypto"
        />
        <div class="wrapper"
             :class="{'progress-bar':progressCrypto}"
        >
        <input class="converter-input"
               v-model="cryptoQuantity"
               type="number"
               @focus="startFiat()"
               @input="calculateCryptoToFiat"
        >
        </div>
      </div>
      <div class="converter-part">
        <ConverterSelect
          :options="fiats"
          :selected="fiat"
          @onSelect="changeFiat"
          :needDisable="true"
          :activeCrypto="crypto"
          :calculateCryptoFiatPairs="calculateCryptoFiatPairs"
        />
        <div class="wrapper"
             :class="{'progress-bar':progressFiat}"
        >
          <input class="converter-input"
                 v-model="fiatQuantity"
                 type="number"
                 step="0.00000000000001"
                 @focus="startCrypto()"
                 @input="calculateFiatToCrypto"
          >
        </div>
      </div>
    </template>
    <template v-else>
      <div class="changer-err-wrapper">
        <template v-if="loading">
          <MoonLoader
            color="#b0becb"
          />
        </template>
        <template v-else>
            {{$t('error_msg.calculator_not_available')}}
        </template>
      </div>
    </template>
  </div>
</template>
<script>
import { GET_RATES } from '../services/requests'
import MoonLoader from 'vue-spinner/src/MoonLoader'
import ConverterSelect from './ConverterSelect'
import cryptos, { fiats } from '../constants/coinsArray'
import { calculateCryptoFiatPairs } from '@/mocks/crypto-fiat-pairs'

export default {
  name: 'Converter',
  components: { ConverterSelect, MoonLoader },
  data () {
    return {
      fiat: 'USD',
      crypto: 'BTC',
      cryptoQuantity: 1,
      fiatQuantity: '',
      progressFiat: true,
      progressCrypto: false,
      fiatTimer:'',
      cryptoTimer:'',
      startInterval: true,
      direction: null,
      loading: false,
      rate: {},
      calculateCryptoFiatPairs: Object.freeze(calculateCryptoFiatPairs)
    }
  },
  methods: {
    getRate () {
      GET_RATES({ event: this.fiat, channel: 'rates_global' })
        .then(({ data }) => {
          this.rate = data[0].fifteenMinutes
          this.calculateCryptoToFiat()
      })
    },
    changeCrypto (crypto) {
      this.crypto = crypto
      if (!this.calculateCryptoFiatPairs[crypto][this.fiat]) {
        this.fiat = 'USD'
      }
      this.calculateCryptoToFiat()
    },
    changeFiat (fiat) {
      this.fiat = fiat
      this.getRate()
    },
    calculateCryptoToFiat () {
      const data = this.rate[this.crypto]
      if (!data || !data.Value) {
        return this.getRate()
      }
      this.fiatQuantity = (data.Value * this.cryptoQuantity).toFixed(5)
    },
    calculateFiatToCrypto () {
      const data = this.rate[this.crypto]
      if (data && data.Value) {
        this.cryptoQuantity = (this.fiatQuantity / data.Value).toFixed(5)
      }
    },
    startFiat () {
      this.stopCrypto()
      this.stopFiat()
      this.progressFiat = true
      this.progressCrypto = false
      this.fiatTimer = setInterval(() => {
        this.progressFiat = false
        GET_RATES({
          event: this.fiat,
          channel: 'rates_global'
        })
            .then(({ data }) => {
              this.progressFiat = true
              this.rate = data[0].fifteenMinutes
              this.calculateCryptoToFiat()
            })
      }, 10000)
    },
    startCrypto () {
      this.stopFiat()
      this.stopCrypto()
      this.progressFiat = false
      this.progressCrypto = true
      this.cryptoTimer = setInterval(() => {
        this.progressCrypto = false
        GET_RATES({
          event: this.fiat,
          channel: 'rates_global'
        })
          .then(({ data }) => {
            this.progressCrypto = true
            this.rate = data[0].fifteenMinutes
            this.calculateFiatToCrypto ()
          })
      }, 10000)
    },
    stopFiat () {
      clearInterval(this.fiatTimer)
    },
    stopCrypto () {
      clearInterval(this.cryptoTimer)
    }
  },
  computed: {
    fiats () {
      return fiats
    },
    cryptos () {
      return cryptos
    }
  },
  created () {
    this.$store.dispatch('GET_RATES', {
      event: this.$store.getters.fiat,
      channel: 'rates_global'
    })
      .then(({ data }) => {
        this.rate = data[0].fifteenMinutes
        this.calculateCryptoToFiat()
        this.startFiat ()
    })
  }
}
</script>

<style scoped lang="scss">
  .converter-input{
    position: relative;
    z-index: 9999;
  }
  .wrapper{
    position: relative;
    width: 100%;
    height: 100%;
    &.progress-bar{
      &::before{
        position: absolute;
        content: '';
        height: 100%;
        width: 100%;
        background: #b6e1cf;
        z-index: 0;
        animation: update-progress 1 10s linear;
      }
    }
    @keyframes update-progress {
      from{
        width: 0;
      }
      to{
        width: 100%;
      }
    }

  }
  input::-webkit-inner-spin-button,
  input::-webkit-outer-spin-button{
    -webkit-appearance:none;
  }
  input[type="number"]{
    -moz-appearance:textfield;
  }
</style>
