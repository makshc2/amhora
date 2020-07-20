import FIAT_SIGNS from '../constants/fiatMap'

export default {
  computed: {
    fiatIcon () {
      return FIAT_SIGNS[this.fiat.toUpperCase()] || this.fiat.toUpperCase()
    }
  }
}
