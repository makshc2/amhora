<template>
  <div>
    <breadcrumbs></breadcrumbs>
    <transaction-details-display
      :transaction="transaction.record || transaction"
      :hash="hash"
    />
  </div>
</template>
<script>
import { GET_TRANSACTION, GET_MEMPOOL } from '../../../services/requests'
import TransactionDetailsDisplay from './TransactionDetailsDisplay'
import { config } from '../../../GlobalConfig'
import { parseTransaction } from '../../../services/parsers'
import Breadcrumbs from '../../commonUI/Breadcrumbs'
import { parseCryptoForRequests } from '../../../mocks/route-crypto-parser'
export default {
  name: 'TransactionDetails',
  components: { Breadcrumbs, TransactionDetailsDisplay },
  props: ['hash'],
  data () {
    return {
      transaction: {}
    }
  },
  computed: {
    crypto () {
      return this.$store.getters.crypto
    },
    fiat () {
      return this.$store.getters.fiat
    },
    rate () {
      return this.$store.getters.rate
    }
  },

  methods: {
    getTransaction () {
      if (this.$route.name === 'TransactionDetails') {
        GET_TRANSACTION({ crypto: parseCryptoForRequests[this.crypto], hash: this.hash })
          .then(transaction => {
            if (config.btcFamilyCoins.includes(this.crypto)) {
              this.transaction = Object.freeze(parseTransaction(transaction, this.crypto, this.$t('explorer.no_address')))
            } else {
              if (this.crypto === 'XMR') {
                this.transaction = Object.freeze(parseTransaction(transaction, this.fiat, 'no Address', this.$t('explorer.no_address')))
              } else if (this.crypto === 'ETH') {
                this.transaction = transaction
              }
            }
            this.show = true
          }).catch(error => {
          console.error(error)
          this.$store.dispatch('LOG_ERR', {
            error: error,
            url: this.$route.path
          })
          this.$router.push('/error')
        })
      } else {
          GET_MEMPOOL ({ crypto: parseCryptoForRequests[this.crypto].toLowerCase(), hash: this.hash })
            .then(transaction => {
              if (config.btcFamilyCoins.includes(this.crypto)) {
                this.transaction = Object.freeze(parseTransaction(transaction, this.crypto, this.$t('explorer.no_address')))
              } else {
                if (this.crypto === 'XMR') {
                  this.transaction = Object.freeze(parseTransaction(transaction, this.fiat, 'no Address', this.$t('explorer.no_address')))
                } else if (this.crypto === 'ETH') {
                  this.transaction = transaction
                }
              }
              this.show = true
            }).catch(error => {
            console.error(error)
            this.$store.dispatch('LOG_ERR', {
              error: error,
              url: this.$route.path
            })
            this.$router.push('/error')
          })
      }
    }
  },

  watch: {
    hash () {
      this.getTransaction()
    }
  },
  created () {
    this.getTransaction()
  }
}
</script>

<style scoped>

</style>
