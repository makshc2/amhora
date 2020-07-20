<template>
  <div class="address-tx-history container" v-if="transactions">
    <div v-if="!showNoTransactionsMessage">
      <template v-if="crypto === 'XMR'">
        <span class="address-tx-history-header">{{$t('explorer.coinbase_transaction')}}</span>
        <table class="table-sm">
          <thead class="table-sm-header">
          <tr>
            <td>{{$t('explorer.hash')}}</td>
            <td>{{$t('explorer.outputs')}}</td>
            <td>{{$t('explorer.size')}} [B]</td>
            <td>{{$t('explorer.version')}}</td>
          </tr>
          </thead>
          <tbody class="table-sm-body">
            <tr>
              <td>
                <router-link class="block-link" :to="{path: `/${$store.getters.crypto.toLowerCase()}/transaction/${blockInformation.record.coinbaseTx.hash}`}">
                {{blockInformation.record.coinbaseTx.hash}}
              </router-link>
              </td>
              <td>{{blockInformation.record.coinbaseTx.totalOutput}}</td>
              <td>{{(blockInformation.record.coinbaseTx.size).toFixed(4)}}</td>
              <td>{{blockInformation.record.coinbaseTx.version}}</td>
            </tr>
          </tbody>
        </table>
        <span class="address-tx-history-header">{{$t('explorer.transaction_tittle')}} ({{transactions.length}})</span>
        <table class="table-sm">
          <thead class="table-sm-header">
          <tr>
            <td>{{$t('explorer.hash')}}</td>
            <td>{{$t('explorer.outputs')}}</td>
            <td>{{$t('explorer.fee')}}</td>
            <td>{{$t('explorer.size')}} [B]</td>
            <td>{{$t('explorer.version')}}</td>
          </tr>
          </thead>
          <tbody class="table-sm-body">
          <template v-for="(item, key) in transactions"
          >
            <tr :key="key">
              <td>
                <router-link class="block-link" :to="{path: `/${$store.getters.crypto.toLowerCase()}/transaction/${item.hash}`}">
                  {{item.hash}}
                </router-link>
              </td>
              <td>{{item.outputs || '?'}}</td>
              <td>{{(item.fee).toFixed(6)}}</td>
              <td>{{(item.size).toFixed(4)}}</td>
              <td>{{item.version}}</td>
            </tr>
          </template>
          </tbody>
        </table>
      </template>
      <template v-else-if="crypto === 'ETH'">
        <table class="table-sm">
          <thead class="table-sm-header">
          <tr>
            <td>{{$t('explorer.height')}}</td>
            <td>{{$t('explorer.tx_hash')}}</td>
            <td>{{$t('explorer.from')}}</td>
            <td>{{$t('explorer.to')}}</td>
            <td>{{$t('explorer.value_eth')}}</td>
          </tr>
          </thead>
          <tbody class="table-sm-body">
          <template v-for="(item, key) in transactions"
          >
            <tr :key="key">
              <td>{{item.blockHeight}}</td>
              <td class="td_overflow">
                <router-link class="block-link" :to="{path: `/${$store.getters.crypto.toLowerCase()}/transaction/${item.hash}`}">
                  <span v-tooltip="{content: item.hash, class: 'tx-hash'}">{{item.hash}}</span>
                </router-link>
              </td>
              <td class="td_overflow cursor-help">
                <span v-tooltip="{content: item.vout.hash, class: 'tx-from'}">{{item.vout.hash}}</span>
                <span v-show="item.vout.isContract" class="contract">
                  {{transactionContract[item.vout.isContract] || ''}}
                </span>
              </td>
              <td class="td_overflow cursor-help">
                <span v-tooltip="{content: item.vin.hash, class: 'tx-to'}">{{(item.vin.hash)}}</span>
                <span v-show="item.vin.isContract" class="contract">
                  {{transactionContract[item.vin.isContract] || ''}}
                </span>
              </td>
              <td>{{item.valueETH}}</td>
            </tr>
          </template>
          </tbody>
        </table>
      </template>
      <template v-else>
        <div class="address-tx-history-header">
          <div class="address-tx-history-header__filters  q-pb-lg"
               v-show="$route.name !== 'Block'"
          >
            <div class="address-tx-history-header__filter" v-if="isShowFilter">
              <span class="address-tx-history-header__filter-text">{{$t('address_info.sort_by')}}</span>
              <SmallSelect
                :items="filterVariables"
                :value="filter"
                @onSelect="onFilterSelect"
              />
            </div>
            <div class="address-tx-history-header__filter" v-if="isShowFilter">
              <span class="address-tx-history-header__filter-text">{{$t('address_info.show')}}</span>
              <SmallSelect
                :items="showVariables"
                :value="show"
                @onSelect="onShowSelect"
              />
            </div>
          </div>
        </div>
        <div
          v-for="(transaction, key, i) in transactions"
          :key="i"
          class="address-tx-history-item"
        >
          <TransactionHeader
            :transaction="transaction"
            :crypto="crypto"
            :headerColor="getHeaderColor(transaction)"
          />
          <TransactionInfo
            class="transaction-display-history__main_address"
            :crypto="crypto"
            :fiat="fiat"
            :total="transaction.totalOutput"
            :inputs="transaction.input || transaction.vin"
            :outputs="transaction.output || transaction.vout"
            :getValueInFiat="getValueInFiat"
          />
        </div>
        <div v-if="!transactions.length" >
          {{$t('global.no_matching')}}
        </div>
      </template>
    </div>
    <div v-show="isShow" v-else>
      {{$t('global.no_matching')}}
    </div>
  </div>
</template>
<script>
import getValueInFiatMixin from '../../../mixins/getValueInFiatMixin'
import TransactionHeader from '../transaction/TransactionHeader'
import TransactionInfo from '../transaction/TransactionInfo'
import SmallSelect from '../../commonUI/SmallSelect'

export default {
  name: 'TransactionsHistory',
  mixins: [getValueInFiatMixin],
  components: {
    SmallSelect,
    TransactionInfo,
    TransactionHeader
  },
  props: {
    countTransaction: {
      type: String
    },
    transactions: {
      type: Array,
      required: false,
      default: () => []
    },
    currentPage: {
      type: Number,
      default: 1
    },
    pages: {
      type: Number,
      default: 1
    },
    getHeaderColor: {
      type: Function,
      required: false,
      default: () => ''
    },
    filterConf: {
      type: String,
      default: 'all'
    },
    orderConf: {
      type: String,
      default: 'desc'
    },
    blockInformation: {
      type: Object
    },
    showNoTransactionsMessage: Boolean
  },
  data () {
    return {
      isShow: false,
      progressTabs: true,
      isActive: true,
      transactionContract: {
        'true': 'Contract'
      },
      show: `transaction_history.all`,
      showVariables: ['transaction_history.all', 'transaction_history.confirmed', 'transaction_history.unconfirmed'],
      filter: `transaction_history.${this.orderConf}`,
      filterVariables: ['transaction_history.asc', 'transaction_history.desc']
    }
  },
  computed: {
    isShowFilter () {
      return !this.transactions[0] || !this.transactions[0].isMempool
    }
  },
  methods: {
    preloaded () {
      setTimeout(() => {
        this.isShow = true
      }, 100)
    },
    selectPage (val) {
      this.$emit('onSelectPage', val)
    },
    onFilterSelect (val) {
      if (val) {
        this.filter = val
        switch (val) {
          case 'transaction_history.asc':
            this.$emit('setOrder', 'asc')
            break
          default:
            this.$emit('setOrder', 'desc')
        }
      }
    },
    onShowSelect: function (val) {
      if (val) {
        this.show = val
        switch (val) {
          case 'transaction_history.confirmed':
            this.$emit('setFilter', 'true')
            break
          case 'transaction_history.unconfirmed':
            this.$emit('setFilter', 'false')
            break
          default:
            this.$emit('setFilter', 'all')
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .market-button{
    background-color: #bfeeda;
    transition: all 2s ease;
  }
  .tab_button{
    padding: 5px;
    cursor: pointer;
    position: relative;
    z-index: 9999;
  }
  .address-tx-history {
    display: flex;
    width: 100%;
    flex-direction: column;
  }

  .address-tx-history-header {
    display: flex;
    justify-content: flex-end;
    padding-bottom: 25px;
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
    display: flex;
  }
  .tabs_2{
    margin-left: 30px;
  }
  .wrapper{
    position: relative;
    width: 100px;
    height: 100%;
    &.progress-bar{
      &::before{
        position: absolute;
        content: '';
        top: -5px;
        left: -5px;
        height: 35px;
        width: 100px;
        background: #b6e1cf;
        z-index: 0;
        border-radius: 3px;
        animation: update-progress 10s linear infinite;
        transform-origin: 0 0;
        transform: scaleX(0);
      }
    }
    @keyframes update-progress {
      to{
        transform: scaleX(1);
      }
    }
  }
  .preloder_wrap{
    margin-top: 16%;
    position: absolute;
    left: 45%;
  }
</style>
