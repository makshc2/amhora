<template>
  <div>
     <vue-headful
        :title="title"
        :description="description"
      />
    <div class="search-wrapper container">
      <search></search>
      <router-link v-show="crypto !=='ETH'" class="block-explorer-btn memory_pool" :to="{path: `${crypto.toLowerCase()}/mempool`}">
        <svg height="20" viewBox="0 0 48 48" width="20" xmlns="http://www.w3.org/2000/svg"><path d="M0 0h48v48h-48z" fill="none"/><path fill="#fff" d="M30 18h-12v12h12v-12zm-4 8h-4v-4h4v4zm16-4v-4h-4v-4c0-2.21-1.79-4-4-4h-4v-4h-4v4h-4v-4h-4v4h-4c-2.21 0-4 1.79-4 4v4h-4v4h4v4h-4v4h4v4c0 2.21 1.79 4 4 4h4v4h4v-4h4v4h4v-4h4c2.21 0 4-1.79 4-4v-4h4v-4h-4v-4h4zm-8 12h-20v-20h20v20z"/></svg>
        {{$t('memory_pool.memory_pool')}}
        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="5" height="6" viewBox="0 0 5 6"><defs><path id="gv8la" d="M525 290l2.543 2.336L525 294.67"/></defs><g><g transform="translate(-524 -289)"><use fill="#fff" fill-opacity="0" stroke="#fff" stroke-miterlimit="50" stroke-width="1.5" xlink:href="#gv8la"/></g></g></svg>
      </router-link>
      <router-link class="block-explorer-btn" :to="{path: `${crypto.toLowerCase()}/blocks`}">
        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="14" height="14"><defs><path id="a" d="M1271 207v-10h10v10z"/><path id="b" d="M1275 211v-10h10v10z"/><clipPath id="c"><use fill="#fff" xlink:href="#a"/></clipPath><clipPath id="d"><use fill="#fff" xlink:href="#b"/></clipPath></defs><use fill="#fff" fill-opacity="0" stroke="#fff" stroke-linejoin="round" stroke-miterlimit="50" stroke-width="3" clip-path="url(&quot;#c&quot;)" xlink:href="#a" transform="translate(-1271 -197)"/><use fill="#fff" fill-opacity="0" stroke="#fff" stroke-linejoin="round" stroke-miterlimit="50" stroke-width="3" clip-path="url(&quot;#d&quot;)" xlink:href="#b" transform="translate(-1271 -197)"/></svg>
        {{$t('block_explorer.block_explorer')}}
        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="5" height="6" viewBox="0 0 5 6"><defs><path id="gv8la" d="M525 290l2.543 2.336L525 294.67"/></defs><g><g transform="translate(-524 -289)"><use fill="#fff" fill-opacity="0" stroke="#fff" stroke-miterlimit="50" stroke-width="1.5" xlink:href="#gv8la"/></g></g></svg>
      </router-link>
    </div>
    <div class="default-explorer container" :class="{center: !transactions.length}">
      <all-transactions
        v-if="transactions.length"
        :transactions="transactions"
      />
      <template v-else>
        <template v-if="loading">
          <MoonLoader
            color='#b0becb'
          />
        </template>
        <template v-else>
          {{$t('error_msg.Transactions')}}
        </template>
      </template>
    </div>
  </div>
</template>
<script>
import Search from './Search.vue'
import AllTransactions from './AllTransactions.vue'
import MoonLoader from 'vue-spinner/src/MoonLoader'
import moment from 'moment'
import { GET_INITIAL_PULL_TRANSACTION } from '../../services/requests'
import { COINS_NAMES } from '../../constants/coinsMap'

export default {
  name: 'DefaultExplorer',
  components: { AllTransactions, Search, MoonLoader },
  data () {
    return {
      transactions: [],
      loading: false,
      subscription: '',
      activeConnectionsExplorer: []
    }
  },
  computed: {
    crypto () {
      return this.$store.getters.crypto
    },
    title () {
      if(this.$route.params.currency) {
        let cryptoName = this.crypto.toUpperCase() === 'DSH' ? 'DASH' : this.crypto.toUpperCase()
        return `${cryptoName} Explorer`
      }
      return 'Amhora'
    },
     description () {
       if(this.$route.params.currency) {
         let coinName = COINS_NAMES[this.crypto.toUpperCase()];
         let cryptoName = this.crypto.toUpperCase() === 'DSH' ? 'DASH' : this.crypto.toUpperCase()
         let desc = `Search ${coinName} (${cryptoName}) blocks, addresses, transactions, memory pools and other data indexed from the blockchain.`
         return desc
       }
       return 'Decentralized, blockchain based banking platform incorporating a suite of crypto tools and services. Accept borderless crypto payments and retain full control of your funds through the cloud.'
     }
  },

  methods: {
    formatDate (date) {
      return moment(+date * 1000).format('DD MMMM YYYY, hh:mm:ss, A')
    },
    getInitialPullTransactions (params) {
      this.loading = true
      GET_INITIAL_PULL_TRANSACTION(params).then(({ data }) => {
        this.transactions = data

        this.loading = false
        this.connectToChanel()
      })
        .catch(() => {
          this.loading = false
        })
    },
    txPoolhandler (data) {
      this.transactions.shift()
      this.transactions.push(data.data[this.crypto])
    },
    connectToChanel () {
      let connection = this.$store.getters['getCentrifugeConnection']
      let haveConnection = false
      this.activeConnectionsExplorer.map((item) => {
        if (item.fiat === this.fiat && item.crypto === this.crypto) haveConnection = true
      })
      if (haveConnection) {
        this.subscription = connection.subscribe('pool_txs_' + this.crypto.toLowerCase(), () => {})
      } else {
        this.subscription = connection.subscribe('pool_txs_' + this.crypto.toLowerCase(), this.txPoolhandler)
        this.activeConnectionsExplorer.push({ fiat: this.fiat, crypto: this.crypto })
      }
    },
    disconnectFromChanel () {
      this.subscription.unsubscribe('pool_txs_' + this.crypto.toLowerCase(), () => {})
    }
  },
  watch: {
    crypto () {
      this.transactions = Array(0)
      this.disconnectFromChanel()
      this.getInitialPullTransactions({ event: this.crypto, channel: 'pool_txs' })
    }
  },
  created () {
    this.getInitialPullTransactions({ event: this.crypto, channel: 'pool_txs' })
  },
  beforeDestroy () {
    this.disconnectFromChanel()
  }
}
</script>
<style scoped>
  .default-explorer {
    width: 100%;
    height: 100%;
    max-height: 100%;
  }

  .default-explorer.center{
    min-height: 50vh;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .search-wrapper{
    display: flex;
    width: 100%;
  }
</style>
