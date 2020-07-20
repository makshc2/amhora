<template>
  <div class="address">
    <breadcrumbs></breadcrumbs>
    <div class="address-title container">
      <div class="address-title-qr">
        <qrcode-vue
          :value="changedBchLtcAddress || address"
          :size="sizeQrcode"
          background="#fff"
          level="H"
        />
      </div>
      <div class="address-title-info">
        <div class="address-title-address">{{ changedBchLtcAddress || address }}
          <button
            v-clipboard="changedBchLtcAddress || address || ''"
            class="copy-button"
            title="copy"
            type="button"
          >
            <svg @click="copyInfo" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="15" height="17" viewBox="0 0 15 17"><defs><path id="cbkqa" d="M987.71 256h9.286v11.607"/><path id="cbkqb" d="M984 271.32v-11.61h9.29v11.61z"/></defs><g><g transform="translate(-983 -255)"><g><use fill="#fff" fill-opacity="0" stroke="#41464a" stroke-miterlimit="50" stroke-width="1.5" xlink:href="#cbkqa"/></g><g><use fill="#fff" fill-opacity="0" stroke="#41464a" stroke-miterlimit="50" stroke-width="1.5" xlink:href="#cbkqb"/></g></g></g></svg>
            <q-tooltip no-parent-event
                       anchor="top middle"
                       self="bottom middle"
                       v-model="showing">
              Copied
            </q-tooltip>
          </button>
          <button
            class="copy-button-reload"
            title="refresh"
            type="button"
            @click="getOrderForTxHistory()"
          >
            <svg class='svg_refresh' enable-background="new 0 0 32 32" height="20px" id="Layer_1" version="1.1" viewBox="0 0 32 32" width="20px" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
              <g>
                <path d="M25.444,4.291c0,0-1.325,1.293-2.243,2.201C18.514,3.068,11.909,3.456,7.676,7.689   c-2.47,2.47-3.623,5.747-3.484,8.983h4C8.051,14.46,8.81,12.205,10.5,10.514c2.663-2.663,6.735-3.043,9.812-1.162   c-1.042,1.032-2.245,2.238-2.245,2.238c-0.841,1.009,0.104,1.592,0.584,1.577l5.624-0.001c0.297,0,0.539,0.001,0.539,0.001   s0.245,0,0.543,0h1.092c0.298,0,0.54-0.243,0.54-0.541V4.895C27.023,4.188,26.247,3.502,25.444,4.291z" fill="#b3b5b7"/>
                <path d="M6.555,27.709c0,0,1.326-1.293,2.243-2.201c4.688,3.424,11.292,3.036,15.526-1.197   c2.47-2.471,3.622-5.747,3.484-8.983h-4.001c0.142,2.211-0.617,4.467-2.308,6.159c-2.663,2.662-6.735,3.043-9.812,1.161   c1.042-1.032,2.245-2.238,2.245-2.238c0.841-1.01-0.104-1.592-0.584-1.577l-5.624,0.002c-0.297,0-0.54-0.002-0.54-0.002   s-0.245,0-0.543,0H5.551c-0.298,0-0.54,0.242-0.541,0.541v7.732C4.977,27.812,5.753,28.498,6.555,27.709z" fill="#b3b5b7"/>
              </g>
            </svg>
          </button>
        </div>
        <div class="cash-type-wrapper">
          <button :disabled="!canTransformAddress || activeCashTypeBtn === 'legacy'"
                  @click="changeBchAddressFormat('toLegacyAddress', 'legacy')"
                  :class="['cash-type', {active: activeCashTypeBtn === 'legacy'}]"
          >
            {{$t('explorer.legacy')}}
          </button>
          <template v-if="canTransformAddress">
            <button
              :disabled="!canTransformAddress || activeCashTypeBtn === 'modern'"
              v-if="crypto === 'LTC'"
              @click="changeBchAddressFormat('toCashAddress', 'modern')"
              :class="['cash-type', {active: activeCashTypeBtn === 'modern'}]"
            >
              {{$t('explorer.modern')}}
            </button>
            <button
              v-else
              :disabled="!canTransformAddress || activeCashTypeBtn === 'cashAddr'"
              @click="changeBchAddressFormat('toCashAddress', 'cashAddr')"
              :class="['cash-type', {active: activeCashTypeBtn === 'cashAddr'}]"
            >
              {{$t('explorer.cashaddr')}}
            </button>
            <span class="ask" v-tooltip.hover="$t('explorer.address_tooltip')">!</span>
          </template>
        </div>
      </div>
    </div>
    <template v-if="!addresInformationIsLoaded">
      <div class="spinner-wrapper">
        <moon-loader
          :class='loaderClass'
          :loading="!addresInformationIsLoaded"
          :color="loaderColor"
          size="50px"
        />
      </div>
    </template>
    <template v-else>
      <AddressMainInfo
        v-if="parsedAddressInformation"
        :parsedAddressInformation="parsedAddressInformation.record"
      />
    </template>
    <template v-if="!addressTransactionsInformationIsLoaded">
      <div class="content-center container">
        <moon-loader
          :class='loaderClass'
          :loading="!addressTransactionsInformationIsLoaded"
          :color="loaderColor"
          size="50px"
        />
      </div>
    </template>
    <template v-else>
      <div class="border-top-wrapper">
        <div class="wrapper_tabs address-tx-history container">
          <div class="transaction_tabs"
               @click="transaction"
          >
            <span
              :class="{active: isActiveTab}"
              class="tab_button"
            >
              {{$t('address_info.transactions')}}
            </span>
          </div>
          <div class="tabs_2 wrapper" @click="mempoolTransactions">
            <span
              class="tab_button"
              :class="{active: !isActiveTab}"
            >
              {{$t('address_info.mempool_transactions')}} ({{countMempool || 0}})
            </span>
          </div>
        </div>
        <div class="preloder_wrap"
             v-if="preload">
          <MoonLoader
            color="#b0becb"
            class="moon-loader"
          ></MoonLoader>
        </div>
        <TransactionsHistory
          v-else
          v-show="!error"
          @transactions="transaction"
          @mempoolTransactions="mempoolTransactions"
          :transactions="parserAddressTransactionsInformation"
          :showNoTransactionsMessage="showNoTransactionsMessage"
          @onSelectPage="selectPage"
          :currentPage="+page"
          :countTransaction = "countTransaction"
          :pages="totalPages"
          :getHeaderColor="getHeaderColor"
          :filterConf="filterConf"
          :orderConf="orderConf"
          @setFilter="getConfUnconfTxHistory"
          @setOrder="getOrderForTxHistory"
        />
      </div>
      <div class="error" v-show="error">
        {{$t('global.no_matching')}}
      </div>
    </template>
    <mugen-scroll
      :handler="getMoreTransactions"
      :should-handle="loadingScrollPagination"
    >
    </mugen-scroll>
  </div>
</template>
<script>
import QrcodeVue from 'qrcode.vue'
import {
  GET_ADDRESS_INFORMATION,
  GET_ADDRESS_TRANSACTIONS_INFORMATION,
  GET_ADDRESS_MEMPOOL_TRANSACTIONS_INFORMATION,
  GET_ALL_MEMPOOL_COUNT
} from '../../../services/requests'
import {
  PARS_XMR_TRANSACTIONS,
  PARS_ETH_TRANSACTIONS
} from '../../../services/util'
import MoonLoader from 'vue-spinner/src/MoonLoader'
import { config } from '../../../GlobalConfig'
import { parseTransaction, parseAddress } from '../../../services/parsers/index'
import { COINS } from '../../../constants/coins'
import Breadcrumbs from '../../commonUI/Breadcrumbs'
import AddressMainInfo from './AddressMainInfo'
import TransactionsHistory from './TransactionsHistory'
import bchaddrjs from 'bchaddrjs'
import { address as liteCoinP2SH } from 'litecoin-p2sh-converter'
import { parseCryptoForRequests } from '../../../mocks/route-crypto-parser'
import MugenScroll from 'vue-mugen-scroll'
export default {
  name: 'Address',
  components: {
    TransactionsHistory,
    AddressMainInfo,
    Breadcrumbs,
    MoonLoader,
    QrcodeVue,
    MugenScroll
  },
  props: ['address'],
  data () {
    return {
      showing: false,
      isActiveTab: true,
      countMempool: '',
      progressTabs: true,
      isActive: true,
      refesh_mempool: '',
      refeshMempoolCount: '',
      error: false,
      preload: false,
      sizeQrcode: 110,
      transactions: [],
      countTransaction: '',
      getNewCountTransaction: '',
      respAddressInformations: [],
      mempool_transaction: false,
      checkTransaction: true,
      page: 1,
      totalPages: 0,
      loadingScrollPagination: true,
      loaderColor: '#b0becb',
      loaderClass: 'address-loader',
      addresInformationIsLoaded: false,
      parsedAddressInformation: {},
      addressTransactionsInformationIsLoaded: false,
      loadPaginate: false,
      showNoTransactionsMessage: false,
      parserAddressTransactionsInformation: [],
      quantity: 25,
      filterConf: 'all',
      orderConf: 'desc',
      changedBchLtcAddress: '',
      activeCashTypeBtn: 'legacy',
      response: []
    }
  },
  computed: {
    crypto () {
      return this.$store.getters.crypto
    },
    fiat () {
      return this.$store.getters.fiat
    },
    addressCurrency () {
      return {
        crypto: parseCryptoForRequests[this.crypto],
        hash: this.address
      }
    },
    isLegacy () {
      try {
        return bchaddrjs.isLegacyAddress(this.changedBchLtcAddress || this.address)
      } catch (e) {
        return false
      }
    },
    isCashAddress () {
      try {
        return bchaddrjs.isCashAddress(this.changedBchLtcAddress || this.address)
      } catch (e) {
        return false
      }
    },
    canTransformAddress () {
      return this.crypto === 'BCH' || (this.crypto === 'LTC' && this.address[0] === '3')
    }
  },
  methods: {
    copyInfo () {
      this.showing = true
      setTimeout(() => {
        this.showing = false
      }, 500)
    },
    transaction () {
      this.isActiveTab = true
      clearInterval(this.refesh_mempool)
      clearInterval(this.refeshMempoolCount)
      this.refeshMempoolCount = setInterval(() => {
        this.getCountMempool()
      }, 5000)
      this.mempool_transaction = false
      this.preload = true
      this.getAddressInformation(this.addressCurrency, { page: this.$route.query.page || 1, quantity: this.quantity, filterConf: this.filterConf })
        .then(() => {
          this.preload = false
        })
    },
    mempoolTransactions () {
      this.isActiveTab = false
      clearInterval(this.refesh_mempool)
      clearInterval(this.refeshMempoolCount)
      this.mempool_transaction = true
      this.preload = true
      this.getAddressInformation(this.addressCurrency, { page: this.$route.query.page || 1, quantity: this.quantity, filterConf: this.filterConf })
        .then(() => {
          this.preload = false
        })
      this.refesh_mempool = setInterval(() => {
        this.getCountMempool()
        this.getAddressInformation(this.addressCurrency, { page: this.$route.query.page || 1, quantity: this.quantity, filterConf: this.filterConf })
      }, 5000)
    },
    getHeaderColor (tx) {
      if (!tx.vin || !Array.isArray(tx.vin)) return ''
      for (let vin of tx.vin) {
        if (vin.address === this.address) {
          return 'red'
        }
      }
      return 'green'
    },
    selectPage (page) {
      this.$router.push({ query: { ...this.$route.query, page: page } })
    },
    parsAddressInformation (resp, addressCurrency, params) {
      let parsAddressInfo = {
        addressInformation: {},
        transactions: []
      }

      if (addressCurrency.currency === 'BTC' || addressCurrency.currency === 'LTC' || addressCurrency.currency === 'DSH') {
        parsAddressInfo.addressInformation = {
          address: resp.address,
          totalBalance: +resp.balance,
          confirmedBalance: resp.balance - resp.unconfirmedBalance,
          pendingBalance: resp.unconfirmedBalance,
          totalReceived: resp.totalReceived,
          totalTransactions: resp.txAppearances
        }
      }
      if (addressCurrency.currency === 'BCH') {
        parsAddressInfo.addressInformation = {
          address: resp.address,
          totalBalance: +resp.total_balance,
          confirmedBalance: resp.confirmed_balance,
          pendingBalance: resp.pending_balance,
          totalReceived: resp.total_received,
          totalTransactions: resp.total_transactions
        }
      }
      if (addressCurrency.currency === 'ETH') {
        parsAddressInfo.addressInformation = {
          address: resp.address,
          totalBalance: false,
          confirmedBalance: false,
          pendingBalance: resp.balance,
          totalReceived: false,
          totalTransactions: resp.total_transactions
        }
      }
      parsAddressInfo.transactions.splice(0, resp.transactions.data.length)
      parsAddressInfo.totalPages = resp.transactions.total_pages
      if (config.btcFamilyCoins.includes(crypto)) {
        resp.transactions.data.forEach(transaction => {
          parsAddressInfo.transactions.push(parseTransaction(transaction, params.fiat_currency, this.$t('explorer.no_address')))
        })
      } else {
        if (this.crypto === 'ETH') {
          resp.transactions.data.forEach(transaction => {
            parsAddressInfo.transactions.push(PARS_ETH_TRANSACTIONS(transaction, params.fiat_currency, this.address, this.$t('explorer.no_address'), true))
          })
        } else if (this.crypto === 'XMR') {
          resp.transactions.data.forEach(transaction => {
            parsAddressInfo.transactions.push(PARS_XMR_TRANSACTIONS(transaction, params.fiat_currency, 'no Address', this.$t('explorer.no_address')))
          })
        }
      }
      return parsAddressInfo
    },
    async getAddressInformation (addressCurrency, params, withAddress = true) {
      if (this.address.match(/[А-Я]/i)) {
        this.$router.push('/' + addressCurrency.crypto + '/404')
        return
      }
      if (config.btcFamilyCoins.includes(this.crypto) || this.crypto === 'ETH') {
        if (withAddress) await this.getAddress(addressCurrency)
        await this.getAddressTransactions(addressCurrency)
      } else {
        await this.getAddressWithTransactions(addressCurrency, params)
      }
      // this.showNoTransactionsMessage = false
    },
    getCountMempool () {
      GET_ALL_MEMPOOL_COUNT({ crypto: this.addressCurrency.crypto, hash: this.addressCurrency.hash })
        .then(resp => {
          this.countMempool = resp.count
        })
    },
    getAddressWithTransactions (addressCurrency, params) {
      GET_ADDRESS_INFORMATION(addressCurrency, params)
        .then(resp => {
          let parsData = this.parsAddressInformation(resp, addressCurrency, params)
          this.parsedAddressInformation = parsData.addressInformation
          this.parserAddressTransactionsInformation = parsData.transactions
          this.totalPages = parsData.totalPages
          this.addresInformationIsLoaded = true
          this.addressTransactionsInformationIsLoaded = true
        }).catch(error => {
          console.error(error)
          this.$store.dispatch('LOG_ERR', {
            error: error,
            url: this.$route.path
          })
          this.$router.push('/error')
        })
    },
    async getAddress (addressCurrency) {
      try {
        let respAddressInformation = await GET_ADDRESS_INFORMATION(addressCurrency)
        this.parsedAddressInformation = parseAddress(respAddressInformation, this.crypto)
        this.addresInformationIsLoaded = true
      } catch (error) {
        console.error(error)
        this.$store.dispatch('LOG_ERR', {
          error: error,
          url: this.$route.path
        })
        this.$router.push('/error')
      }
    },
    async getAddressTransactions (currency, params) {
      try {
        if (!this.mempool_transaction) {
          this.error = false
          this.response = await GET_ADDRESS_TRANSACTIONS_INFORMATION(currency, params)
        } else {
          this.response = await GET_ADDRESS_MEMPOOL_TRANSACTIONS_INFORMATION(currency, params)
            .catch(err => {
              if (Object.keys(err.options.qs).length === 0) {
                this.error = true
              }
            })
        }
        if (!this.response.records.length) {
          this.showNoTransactionsMessage = true
          this.addressTransactionsInformationIsLoaded = true
          return
        } else {
          this.showNoTransactionsMessage = false
        }
        if (config.btcFamilyCoins.includes(this.crypto)) {
          if (this.response.page === 1) {
            this.parserAddressTransactionsInformation = this.response.records
          } else {
            this.parserAddressTransactionsInformation.push(...this.response.records)
          }
        } else {
          if (this.crypto === COINS.eth) {
            this.parserAddressTransactionsInformation =
              Object.freeze(
                this.response.txs.map(transaction => {
                  return PARS_ETH_TRANSACTIONS(
                    transaction,
                    this.fiat,
                    this.address,
                    this.$t('explorer.no_address'),
                    true
                  )
                })
              )
          }
          if (this.crypto === COINS.xmr) {
            this.parserAddressTransactionsInformation =
              Object.freeze(this.response.data.map(transaction => {
                return PARS_XMR_TRANSACTIONS(
                  transaction,
                  this.fiat,
                  'no Address',
                  this.$t('explorer.no_address')
                )
              })
              )
          }
        }
        if (!this.parserAddressTransactionsInformation.length) {
          this.showNoTransactionsMessage = true
        }
        this.loadingScrollPagination = true
        this.addressTransactionsInformationIsLoaded = true
      } catch (error) {
        this.$store.dispatch('LOG_ERR', {
          error: error,
          url: this.$route.path
        })
        this.loadingScrollPagination = false
        this.addressTransactionsInformationIsLoaded = true
        if (Object.keys(error.options.qs).length === 1) {
          this.parserAddressTransactionsInformation = []
        }
      }
    },
    getMoreTransactions () {
      this.loadingScrollPagination = true
      this.loadPaginate = true
      this.page++
      let prevPosition = window.scrollY
      this.getAddressTransactions(this.addressCurrency, { page: this.page, conf: this.filterConf, order: this.orderConf })
        .then(async () => {
          await this.$nextTick()
          window.scrollTo(0, prevPosition)
        })
    },
    getConfUnconfTxHistory (value) {
      this.filterConf = value
      this.page = 1
      this.parserAddressTransactionsInformation = Array(0)
      this.getAddressTransactions(this.addressCurrency, { page: this.page, conf: this.filterConf, order: this.orderConf })
    },
    getOrderForTxHistory (value) {
      this.orderConf = value
      this.page = 1
      this.parserAddressTransactionsInformation = Array(0)
      this.checkTransaction = true
      this.getAddressTransactions(this.addressCurrency, { page: this.page, conf: this.filterConf, order: this.orderConf })
    },
    changeBchAddressFormat (bchMethod, activeBtn) {
      const versionsForLTC = { 5: 50, 50: 5, 196: 58, 58: 196 }
      this.activeCashTypeBtn = activeBtn
      if (this.crypto === 'BCH') {
        this.changedBchLtcAddress = bchaddrjs[bchMethod](this.address).split('bitcoincash:')[1]
        return
      }
      if (this.crypto === 'LTC') {
        const decoded = liteCoinP2SH.fromBase58Check(this.changedBchLtcAddress || this.address)
        this.changedBchLtcAddress = liteCoinP2SH.toBase58Check(decoded.hash, versionsForLTC[decoded.version])
      }
    },
    checkModernAddress () {
      if (this.canTransformAddress) {
        this.changeBchAddressFormat('toCashAddress', 'modern')
      }
    }

  },
  beforeRouteUpdate  (to, from, next) {
    document.body.scrollTop = document.documentElement.scrollTop = 0
    next()
  },
  watch: {
    address () {
      this.getAddressInformation(this.addressCurrency, { page: this.$route.query.page || 1, quantity: this.quantity })
      if (this.canTransformAddress && this.crypto === 'BCH') {
        this.changeBchAddressFormat('toLegacyAddress', 'legacy')
        this.activeCashTypeBtn = 'legacy'
      } else if (this.crypto === 'LTC') {
        this.changedBchLtcAddress = this.$router.path
        this.activeCashTypeBtn = 'legacy'
      }
    },
    '$route.query.page' () {
      this.getAddressInformation(this.addressCurrency, { page: this.$route.query.page || 1, quantity: this.quantity })
    }
  },
  beforeDestroy () {
    clearInterval(this.refesh_mempool)
    clearInterval(this.refeshMempoolCount)
  },
  created () {
    // this.checkModernAddress()
    this.refeshMempoolCount = setInterval(() => {
      this.getCountMempool()
    }, 1000)
    this.getCountMempool()
    this.getAddressInformation(this.addressCurrency, { page: this.$route.query.page || 1, quantity: this.quantity, filterConf: this.filterConf })
  }
}
</script>
<style scoped lang="scss">

  .address {
    width: 100%;
    max-height: 100%;
    height: 100%;
  }

  .address-title{
    display: flex;
    width: 100%;
  }
  .address-title-info{
    margin-left: 28px;
    width: 100%;
  }
  .address-title-address{
    display: flex;
    color: #41464a;
    font-size: 18px;
    font-weight: 500;
    margin-bottom: 12px;
  }
  .error{
    margin-top: 100px;
  }
  .cash-type{
    display: inline-block;
    border-radius: 2px;
    border: 1px solid #97979720;
    background-color: #d8d8d820;
    /*color: #41464a50;*/
    padding: 7px;
    cursor: pointer;
    &.active{
       padding: 12px;
       border-radius: 2px;
       background-color: #41464a;
       font-size: 13px;
       font-family: "Avenir Next Cyr Demi",sans-serif;
       letter-spacing: -0.19px;
       color: #fff;
       border: none;
     }
    &:disabled {
      cursor: default;
    }
  }
  .ask{
    margin-left: 17px;
  }

  .border-top-wrapper{
    padding-top: 10px;
    margin-top: 8px;
  }
  .mugen-scroll {
    text-align: center;
    display: flex;
    justify-content: center;
  }
  .moon-loader{
    padding-top: 20px;
    text-align: center;
  }
  .error{
    padding-left: 70px;
    display: flex;
    justify-content: center;
  }
  .preloder_wrap{
    margin-top: 15%;
    position: absolute;
    left: 45%;
  }
  .market-button{
    background-color: #bfeeda;
    transition: all 2s ease;
  }
  .transaction_tabs{
    border-radius: 3px;
    background-color:#e6e6e6;
  }
  .tab_button{
    background-color:#e6e6e6;
    padding: 10px 20px;
    cursor: pointer;
    position: relative;
    top: 5px;
    z-index: 9999;
    color: #41464a;
    font-size: 16px;
    border-radius: 3px;
    font-family: Avenir Next Cyr Demi,sans-serif;
  }
  .address-tx-history {
    display: flex;
    width: 100%;
    flex-direction: column;
  }

  .address-tx-history-header {
    display: flex;
    justify-content: space-between;
    padding-bottom: 18px;
    color: #41464a;
    font-size: 18px;
    font-family: "Avenir Next Cyr Demi", sans-serif;
  }

  .address-tx-history-item {
    width: 100%;
    border-radius: 5px;
    border: 1px solid #97979720;
    display: flex;
    flex-direction: column;
    margin-bottom: 12px;
  }

  .address-tx-history-header__filters {
    display: flex;
  }

  .address-tx-history-header__filter {
    display: flex;
    align-items: center;

    &:last-child {
      margin-left: 23px;
    }
  }

  .address-tx-history-header__filter-text {
    color: #41464a50;
    font-size: 13px;
    font-weight: 500;
    margin-right: 8px;
  }
  .address-tx-history-header{
    padding-top: 20px;
  }
  .td_overflow{
    max-width: 200px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .contract {
    border-radius: 3px;
    background-color: #427091;
    color: #fff;
    font-size: 14px;
    padding: 3px;
    margin-left: 10px;
  }
  .cursor-help{
    cursor: default;
  }
  .wrapper_tabs{
    position: relative;
    bottom: -40px;
    margin: 0 auto;
    display: flex;
    flex-direction: row;
  }
  .tabs_2{
    margin-left: 20px;
    border-radius: 3px;
  }
  .wrapper{
    background-color:#e6e6e6;
    position: relative;
    height: 35px;
  }
  .transaction_tabs, .tab_button{
    &:hover{
      background-color: #41464a;
      color: #fdfdfd;
    }
  }
  .active{
    transition: background-color, color .4s !important;
    background-color: #41464a !important;
    color: #fdfdfd !important;
  }
</style>
