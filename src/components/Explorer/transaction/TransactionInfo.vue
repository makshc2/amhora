<template>
  <div class="transaction-display-history__main">
    <template v-if="crypto === 'XMR'">
      <div class="wrapper_transaction">
        <span class="text_info-transaction">{{outputs.length}} {{$t('transaction_info.total_outputs')}} {{crypto.toLowerCase()}}</span>
      <div class="table-wrapper table-from">
        <table>
          <thead class="transaction-display-history-table__header">
          <tr>
            <td class="transaction-display-history-table__header-item transaction-display-history-table__header-item-lg">
              #
            </td>
            <td class="transaction-display-history-table__header-item transaction-display-history-table__header-item-lg">
              {{$t('transaction_info.stealth_address')}}
            </td>
            <td class="transaction-display-history-table__header-item transaction-display-history-table__header-item-lg">
              {{$t('transaction_info.amount')}}
            </td>
          </tr>
          </thead>
          <tbody>
          <tr
            v-for="(input, key) in outputs"
            :key="key"
          >
            <td>
              {{key}}
            </td>
            <td>{{input.hash}}</td>
            <td>{{+input.amount || '?'}}</td>
          </tr>
          </tbody>
        </table>
      </div>
        <span class="text_info-transaction-inputs">{{inputs.length}} {{$t('transaction_info.total_inputs')}} {{crypto.toLowerCase()}}</span>
        <div class="table-wrapper table-from table-to_transaction">
          <table>
            <thead class="transaction-display-history-table__header">
            <tr>
              <td class="transaction-display-history-table__header-item transaction-display-history-table__header-item-lg">
                #
              </td>
              <td class="transaction-display-history-table__header-item transaction-display-history-table__header-item-lg">
                {{$t('transaction_info.key_image')}}
              </td>
              <td class="transaction-display-history-table__header-item transaction-display-history-table__header-item-lg">
                {{$t('transaction_info.amount')}}
              </td>
            </tr>
            </thead>
            <tbody>
            <tr
              v-for="(input, key) in inputs"
              :key="key"
            >
              <td>
                {{key}}
              </td>
              <td>{{input.hash}}</td>
              <td>{{+input.amount || '?'}}</td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
    </template>
    <template v-else>
      <div class="table-wrapper table-from " v-bind:class="inputs.length ? '' : 'coinbase-container'">
      <table>
        <thead class="transaction-display-history-table__header" >
        <tr>
          <td class="transaction-display-history-table__header-item transaction-display-history-table__header-item-lg">{{$t('transaction_info.from')}}</td>
          <td
            class="transaction-display-history-table__header-item"
            v-show="isAdvancedView"
          >
            {{$t('transaction_info.output')}} {{crypto}}
          </td>
        </tr>
        </thead>
        <tbody>
        <template  v-if="inputs.length">
          <tr
            v-for="(input, key) in inputs"
            :key="key"
          >
            <td
              :style="input.address === 'coinbase'? 'width:400px':''"
            >
              <router-link
                :class="{'disable-route': (['ETH', 'XMR'].includes(crypto) || input.address === 'unparsed address')}"
                           :to="{path: `/${$store.getters.crypto.toLowerCase()}/address/${input.address}`}">
                {{input.address === 'coinbase'?'~coinbase': input.address || input.hash }}
              </router-link>
              <span
                v-show="input.address === 'coinbase'"
                class="help"
                v-tooltip.top="{
                content: $t('block_explorer.coinbaseInfo')
                }">
                  !
              </span>
            </td>
            <td v-show="isAdvancedView" >
              {{input.value || satToCripto(input.valueSat) || '-'}}
            </td>
          </tr>
        </template>
        <tr v-else>
          <td >
            {{$t('block_explorer.coinbase')}}
            <span
              class="help"
              v-tooltip.top="{
                content: $t('block_explorer.coinbaseInfo')
              }">
                !
            </span>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
      <div class="table-wrapper table-to">
      <table>
        <thead class="transaction-display-history-table__header">
        <tr>
          <td class="transaction-display-history-table__header-item border-top-left-hide">{{$t('transaction_info.to')}}</td>
          <td class="transaction-display-history-table__header-item">{{$t('transaction_info.output')}} {{crypto}}</td>
          <td class="transaction-display-history-table__header-item">{{$t('transaction_info.output')}} {{fiat}}</td>
          <td v-show="showBullet"
            class="transaction-display-history-table__header-item"></td>
        </tr>
        </thead>
        <tbody>
        <tr
          v-for="(output, key) in outputs"
          :key="key"
        >
          <td>
              <router-link
                :class="{'disable-route': (['ETH', 'XMR'].includes(crypto) || output.address === 'unparsed address')}"
                :to="{path: `/${crypto.toLowerCase()}/address/${output.address}`}">
                {{output.address === 'unparsed address'? $t('block_explorer.unparsed_address'):output.address || output.hash || '-'}}
              </router-link>
            <span class="eth-contract" v-show="output.isContract">{{$t('explorer.contract')}}</span>
          </td>
          <td>{{outputsCount || output.value && output.value.toFixed(8)}}</td>
          <td
            v-if="outputsCount || output.value"
          >
            {{fiatToCrypto ? (outputsCount*fiatToCrypto || output.value*fiatToCrypto).toFixed(2) : $t('xrp_text.na')}}
          </td>
          <td v-else></td>
          <td v-show="showBullet">
            <span
              v-tooltip.hover="output.chainedHash ? $t('transaction_info.spent_funds') : $t('transaction_info.unspent_funds')"
              :class="['transaction-status-indicator', {'confirmed': output.chainedHash}]">
            </span>
          </td>
        </tr>
        <tr v-if="total" class="table-total">
          <td>
            {{$t('transaction_info.total')}}
            <span class="ask" v-tooltip.hover="$t('transaction_info.tooltip_total')">!</span>
          </td>
          <td style="width: 120px">{{Math.abs(total).toFixed(8)}}</td>
          <td style="width: 120px">{{fiatToCrypto ? (Math.abs(total)*fiatToCrypto).toFixed(2) : $t('xrp_text.na')}}</td>
        </tr>
        </tbody>
      </table>
    </div>
    </template>
  </div>
</template>

<script>
import { GET_RATES } from '@/services/requests'

export default {
  name: 'TransactionInfo',
  data () {
    return {
      fiatToCrypto: '',
      valueCrypto: ''
    }
  },
  props: {
    outputsCount: {
      type: String
    },
    isAdvancedView: {
      type: Boolean,
      required: false,
      default: false
    },
    showBullet: {
      type: Boolean,
      required: false,
      default: false
    },
    crypto: {
      type: String,
      required: true
    },
    fiat: {
      type: String,
      required: true
    },
    inputs: {
      type: Array,
      default () {
        return []
      }
    },
    outputs: {
      type: Array,
      default () {
        return []
      }
    },
    getValueInFiat: {
      type: Function,
      required: true
    },
    total: {
      type: Number,
      required: false
    }
  },
  methods: {
    satToCripto (val) {
      const cryptoVal = (val * Math.pow(10, -8)).toFixed(8)
      return isNaN(cryptoVal) ? '' : cryptoVal
    },
    selectFiat () {
      GET_RATES({
        event: this.fiat,
        channel: 'rates_global'
      })
        .then(({ data }) => {
          if (data[0].hour[this.crypto].Value) {
            this.fiatToCrypto = data[0].hour[this.crypto].Value
          }
        })
        .catch(() => {
          this.fiatToCrypto = null
        })
    }
  },
  computed: {
    symbolForEmpty () {
      return this.crypto === 'ETH' ? '0' : '-'
    }
  },
  updated () {
    this.selectFiat()
  },
  created () {
    this.selectFiat()
  }
}
</script>

<style lang="scss" scoped>
  .transaction-display-history__main{
    display: flex;
    width: 100%;
    &.transaction-display-history__main_address{
      .transaction-display-history-table__header{
        background-color: transparent;
        tr>td{
          padding: 0 18px;
        }
      }
      table{
        tbody > tr{
          &:nth-child(odd){
            background-color: #f6f6f6;
          }
          &:nth-child(even){
            background-color: transparent;
          }
          td{
            padding: 0 18px;
            height: 35px;
          }
        }
      }
    }
  }
  .transaction-status-indicator {
    display: inline-block;
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background-color: limegreen;

    &.confirmed {
      background-color: red;
    }
  }
  .transaction-display-history__main{
    border-top-right-radius: 5px;
    border-top-left-radius: 5px;
    overflow: hidden;
  }
  .coinbase-container{
    &.table-from{
      min-width: 300px;
    }
  }

  .table-wrapper{
    display: flex;
    &.table-to{
      width: 100%;
    }
    table{
      width: 100%;
      border-spacing: 0;
      tr{
        white-space: nowrap;
      }
    }
  }
  .transaction-display-history-table__header{
    background-color: #f6f6f6;
    tr>td{
      font-family: "Avenir Next Cyr Medium";
      padding: 0 18px;
      font-size: 13px;
      color: #41464a;
      letter-spacing: 0.2px;
      height: 35px;
    }
  }
  table{
    tbody > tr{
      &:nth-child(even){
        background-color: #f6f6f6;
      }
      td{
        padding: 0 18px;
        font-size: 13px;
        color: #41464a;
        letter-spacing: 0.2px;
        height: 35px;
        a{
          color: #41464a;
        }
      }
    }
  }
  .table-wrapper.table-to{
    table{
      tr> td:not(:first-child){
        text-align: right;
      }
      tr.table-total{
        text-align: right;
        font-family: "Avenir Next Cyr Demi", sans-serif;
        background-color: transparent!important;
        td{
          padding-top: 20px;
          padding-bottom: 18px;
        }
      }
    }
  }

  .help{
    display: inline-flex;
    justify-content: center;
    align-items: center;
    color: #41464a50;
    height: 16px;
    width: 16px;
    font-size: 13px;
    text-align: center;
    transform: rotate(180deg);
    border-radius: 50%;
    cursor: pointer;
    text-transform: uppercase;
    border: 1px solid #41464a50;
    font-weight: 600;
    margin-left: 5px;
  }
  .help:hover{
    color: #fff;
    background-color: #41464a;
  }

  .disable-route{
    pointer-events: none;
    cursor: default;
  }
  .wrapper_transaction{
    display: flex;
    flex-direction: column;
    width: 100%;
  }
  .table-to_transaction{
    margin-top: 20px;
  }
  .text_info-transaction{
    margin-bottom: 20px;
  }
  .text_info-transaction-inputs{
    margin-top: 20px;
  }
  .border-top-left-hide{
    border-top-left-radius: 0 !important;
  }
</style>
