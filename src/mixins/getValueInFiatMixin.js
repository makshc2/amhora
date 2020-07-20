import FIAT_SIGNS from '../constants/fiatMap'

export default {
  methods: {
    getValueInFiat (valInCrypto) {
      if (typeof valInCrypto === 'number' && this.rate_fiat) {
        return ((valInCrypto * this.rate_fiat).toFixed(2)) === '0.00'
          ? Math.abs((valInCrypto * this.rate_fiat).toFixed(4))
          : Math.abs((valInCrypto * this.rate_fiat).toFixed(2))
      }
      return ''
    }
  },
  computed: {
    rate () {
      return this.$store.getters.rate
    },
    crypto () {
      return this.$store.getters.crypto
    },
    fiat () {
      return this.$store.getters.fiat
    },
    rate_fiat () {
      if (this.rate && this.rate[this.crypto.toUpperCase()]) {
        return this.rate[this.crypto.toUpperCase()].toFixed(2)
      }
    },
    fiatIcon () {
      return FIAT_SIGNS[this.fiat.toUpperCase()] || this.fiat.toUpperCase()
    }
  }
}
