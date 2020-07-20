<template>
  <div class="block">
    <breadcrumbs></breadcrumbs>
    <template v-if="isBlockInformationLoaded">
      <div class="block-information-header container">
        <div class="block-title">
          <div class="block-title-hash">
            {{ blockInformation.hash }}
          </div>
          <button type="button" class="copy-button" v-clipboard="blockInformation.hash || ''" title="copy">
            <svg @click="copyInfo"  xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="15" height="17" viewBox="0 0 15 17"><defs><path id="cbkqa" d="M987.71 256h9.286v11.607"/><path id="cbkqb" d="M984 271.32v-11.61h9.29v11.61z"/></defs><g><g transform="translate(-983 -255)"><g><use fill="#fff" fill-opacity="0" stroke="#41464a" stroke-miterlimit="50" stroke-width="1.5" xlink:href="#cbkqa"/></g><g><use fill="#fff" fill-opacity="0" stroke="#41464a" stroke-miterlimit="50" stroke-width="1.5" xlink:href="#cbkqb"/></g></g></g></svg>
            <q-tooltip no-parent-event
                       anchor="top middle"
                       self="bottom middle"
                       v-model="showing">
              Copied
            </q-tooltip>
          </button>
        </div>
        <div class="block-root" v-show="crypto !== 'XMR'">
          <span class="block-root__text">Merkle Root </span>
          <span class="block-root__value">{{blockInformation.record.merkleRoot}}</span>
        </div>
      </div>
      <div class="block-information container">
        <block-details-default
          v-if="!isBTCFamily"
          :block-information="blockInformation"
        />

        <block-details-bitcoin-family
          v-if="isBTCFamily"
          :block-information="blockInformation.record"
        />
      </div>
    </template>
    <template v-else>
      <div class="spinner-wrapper">
        <moon-loader
          :class="loaderClass"
          :loading="!isBlockInformationLoaded"
          :color="loaderColor"
          size="50px"
        />
      </div>
    </template>
    <template v-if="isBlockTransactionsLoaded">
      <template v-if="transactions.length">
        <div class="border-top-wrapper test">
          <TransactionsHistory
            :blockInformation="blockInformation"
            :transactions="transactions"
            @onSelectPage="selectPage"
            :currentPage="+page"
            :pages="pages"
            :filterConf="filterConf"
            :orderConf="orderConf"
            @setFilter="getConfUnconfTxHistory"
            @setOrder="getOrderForTxHistory"
          />
          <PaginationComponent
            class="container"
            v-if="this.blockInformation.record && totalPages>1"
            :currentPage="page"
            :totalPages="totalPages"
            :selectPage="selectPage"
            :showedRecords="quantity"
            :recordsCount="0"
          />
        </div>
      </template>
      <template v-else>
        <no-data-message :message="$t('global.no_matching')" />
      </template>
    </template>
    <template v-else>
      <div class="content-center container">
        <moon-loader
          :class='loaderClass'
          :loading="!isBlockTransactionsLoaded"
          :color="loaderColor"
          size="50px"
        />
      </div>
    </template>
  </div>
</template>
<script>
import TransactionsHistory from '../address/TransactionsHistory'
import BlockDetailsBitcoinFamily from './BlockDetailsBitcoinFamily'
import BlockDetailsDefault from './BlockDetailsDefault'
import NoDataMessage from '../NoDataMessage'
import { GET_BLOCK, GET_BLOCK_WITH_TRANSACTIONS } from '../../../services/requests'
import {
  HANDLING_ERROR,
  PARS_ETH_TRANSACTIONS
} from '../../../services/util'
import { SEND_LOGGS_TO_SENTRY } from '../../../services/logging'
import MoonLoader from 'vue-spinner/src/MoonLoader'
import { config } from '../../../GlobalConfig'
import PaginationComponent from '../../commonUI/Pagination'
import { BlockRecord, BlockRecordBitcoinFamily } from '../../../services/records'
import Breadcrumbs from '../../commonUI/Breadcrumbs'
import { parseCryptoForRequests } from '../../../mocks/route-crypto-parser'
export default {
  name: 'BlockDetails',
  components: {
    TransactionsHistory,
    Breadcrumbs,
    MoonLoader,
    BlockDetailsBitcoinFamily,
    BlockDetailsDefault,
    NoDataMessage,
    PaginationComponent
  },
  props: ['block'],
  data () {
    return {
      showing: false,
      blockInformation: {},
      transactions: [],
      loaderColor: '#c6b0de',
      loaderClass: 'loader_block',
      isBlockInformationLoaded: false,
      isBlockTransactionsLoaded: false,
      page: 1,
      pages: 1,
      quantity: 25,
      filterConf: 'all',
      orderConf: 'desc'
    }
  },
  computed: {
    crypto () {
      return this.$store.getters.crypto
    },
    fiat () {
      return this.$store.getters.fiat
    },
    isBTCFamily () {
      return config.btcFamilyCoins.includes(this.crypto)
    },
    totalPages () {
      return Math.ceil(this.blockInformation.record.transactionCount / this.quantity) ||
        Math.ceil(this.blockInformation.record.countTx / this.quantity) ||
        Math.ceil(this.blockInformation.record.txCount / this.quantity)
    }
  },
  methods: {
    copyInfo () {
      this.showing = true
      setTimeout(() => {
        this.showing = false
      }, 1000)
    },
    getConfUnconfTxHistory (value) {
      this.filterConf = value
      this.getBlock({ crypto: parseCryptoForRequests[this.crypto],
        hash: this.block },
      { page: this.$route.query.page || 1,
        pageSize: this.$route.query.per_page || this.quantity,
        conf: this.filterConf,
        order: this.orderConf })
    },
    getOrderForTxHistory (value) {
      this.orderConf = value
      this.getBlock({ crypto: parseCryptoForRequests[this.crypto], hash: this.block }, { page: this.$route.query.page || 1, pageSize: this.$route.query.per_page || this.quantity, conf: this.filterConf, order: this.orderConf })
    },

    getBlock (data, filters) {
      if (this.block.match(/[А-Я]/i)) {
        this.$router.push('/' + this.crypto + '/404')
      } else {
        this.loadBlockInformation(data, filters)
        this.loadBlockTransactions(data, filters)
      }
    },
    async loadBlockInformation (data, filters) {
      this.isBlockTransactionsLoaded = false
      try {
        const blockInformation = await GET_BLOCK(data, filters)
        this.isBlockInformationLoaded = true
        this.blockInformation = Object.freeze(this.parseBlockInformation(blockInformation))
      } catch (error) {
        this.isBlockInformationLoaded = false
        this.errorHandler(error)
      }
    },
    loadBlockTransactions (data, filters) {
      this.isBlockTransactionsLoaded = false
      GET_BLOCK_WITH_TRANSACTIONS(data, filters)
        .then(resp => {
          this.transactions = this.parseBlockTransactions(resp.records) || []
          this.page = resp.page
          this.pages = resp.pages
          this.quantity = resp.pageSize
        })
        .catch(e => {
          this.errorHandler(e)
        })
        .finally(() => {
          this.isBlockTransactionsLoaded = true
        })
    },
    parseBlockTransactions (transactions) {
      if (this.crypto !== 'XMR' && this.crypto !== 'ETH') {
        if (transactions && transactions.length) {
          const parsedTransactions = []
          if (this.isBTCFamily) {
            transactions.forEach(transaction => {
              parsedTransactions.push(transaction)
            })
          } else {
            if (this.crypto === 'ETH') {
              transactions.forEach(transaction => {
                parsedTransactions.push(PARS_ETH_TRANSACTIONS(transaction, this.fiat, null, this.$t('explorer.no_address'), true))
              })
            }
          }
          return parsedTransactions
        }
      } else {
        return transactions
      }
    },
    parseBlockInformation (blockInformation) {
      let parsedBlockInformation
      if (this.isBTCFamily) {
        parsedBlockInformation = new BlockRecordBitcoinFamily(blockInformation)
      } else {
        parsedBlockInformation = new BlockRecord(blockInformation, {
          unknowText: this.$t('explorer.unknow'),
          currency: this.crypto,
          block: this.block
        })
      }
      return parsedBlockInformation
    },
    // legacy
    getBlockInformationWithTransactions (data, filters) {
      if (this.block.match(/[А-Я]/i)) {
        this.$router.push('/' + this.$store.getters.crypto + '/404')
      } else {
        GET_BLOCK(data, filters)
          .then(resp => {
            this.transactions = this.parseBlockTransactions(resp.transactions)
            this.blockInformation = this.parseBlockInformation(resp)
          }).catch(error => {
            this.errorHandler(error)
          })
          .finally(() => {
            this.isBlockInformationLoaded = true
            this.isBlockTransactionsLoaded = true
          })
      }
    },
    errorHandler (error) {
      console.error(error)
      SEND_LOGGS_TO_SENTRY(error)
      if (error.error.message !== 'Failed to fetch') {
        this.$store.commit('SET_ERROR', {
          msg: HANDLING_ERROR(error, this.$t),
          url: document.location.href
        })
      } else {
        this.$store.commit('SET_ERROR', {
          msg: HANDLING_ERROR(error, this.$t),
          url: document.location.href
        })
      }
      this.$router.push('/error')
    },
    selectPage (page) {
      this.$router.push({ query: { ...this.$route.query, page: page } })
      this.getBlock({ crypto: parseCryptoForRequests[this.crypto], hash: this.block }, { page: this.$route.query.page || 1, pageSize: this.$route.query.per_page || this.quantity })
    }
  },
  watch: {
    block () {
      this.getBlock({ currency: this.crypto, hash: this.block.trim() }, { page: this.$route.query.page || 1, quantity: this.quantity })
    }
  },
  mounted () {
    this.getBlock({ crypto: parseCryptoForRequests[this.crypto], hash: this.block }, { page: this.$route.query.page || 1, pageSize: this.$route.query.per_page || this.quantity })
  }
}
</script>
<style scoped lang="scss">
  .block {
    width: 100%;
    max-height: 100%;
    height: 100%;
  }

  .block-information-header{
    display: flex;
    flex-direction: column;
    width: 100%;
    .block-root {
      margin-top: 10px;
      .block-root__text {
       color: #41464a50;
      }
      .block-root__value {
        background-color: #f6f6f6;
        margin-left: 5px;
        padding: 3px 7px;
        border-radius: 3px;
      }
    }
  }
  .block-title{
    display: flex;
    color: #41464a;
    font-size: 18px;
    font-weight: 500;
  }
  .block-title-hash{
    display: flex;
    align-items: center;
  }
  .border-top-wrapper{
    padding-top: 40px;
    margin-top: 8px;
  }
</style>
