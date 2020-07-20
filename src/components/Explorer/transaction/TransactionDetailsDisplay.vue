<template>
  <div class="wrapper" v-if="crypto === 'XMR'">
    <div class="transaction-info " v-if="transaction">
      <div class="transaction-title container">
        <div class="transaction-hash transaction-gray-header-text">
          {{ transaction.hash }}
        </div>
        <button class="copy-button" v-clipboard="transaction.hash || ''" title="copy">
          <svg @click="copyInfo"  xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="15" height="17" viewBox="0 0 15 17"><defs><path id="cbkqa" d="M987.71 256h9.286v11.607"/><path id="cbkqb" d="M984 271.32v-11.61h9.29v11.61z"/></defs><g><g transform="translate(-983 -255)"><g><use fill="#fff" fill-opacity="0" stroke="#41464a" stroke-miterlimit="50" stroke-width="1.5" xlink:href="#cbkqa"/></g><g><use fill="#fff" fill-opacity="0" stroke="#41464a" stroke-miterlimit="50" stroke-width="1.5" xlink:href="#cbkqb"/></g></g></g></svg>
          <q-tooltip no-parent-event
                     anchor="top middle"
                     self="bottom middle"
                     v-model="showing">
            Copied
          </q-tooltip>
        </button>
      </div>
      <div class="transaction-common-info container">
        <div class="transaction-segwit" v-if="transaction.record && transaction.record.hasSegwit">
          <img class="sighwid" v-show="transaction.record.hasSegwit" src="@/assets/resources/icons/sighwid.svg" alt="sighwid">
          Segwit
        </div>
        <div class="transaction-common-info__item" v-if="isLoadTransaction">
          <div :class="['transaction-status', {'transaction-confirmed': transaction.confirmations > 5}]">
            <template v-if="transaction.confirmations > 5">{{$t('explorer.confirmed')}}</template>
            <template v-else>{{$t('explorer.unconfirmed')}}</template>
          </div>
          <template v-if="transaction.confirmations"  >
            <span v-show="transaction.confirmations === 1">
              {{ transaction.confirmations }} {{$t('explorer.confirmation')}}
            </span>
            <span v-show="transaction.confirmations > 1">
              {{ transaction.confirmations }} {{$t('explorer.confirmations')}}
            </span>
          </template>
        </div>
      </div>
      <div class="transaction-main-info container">
        <div class="transaction-main-info__block">
          <table class="transaction-main-info__block-item-table">
            <tr>
              <td>
                <span>{{$t('explorer.date')}}</span>
              </td>
              <td colspan="2">
                {{ getTime(transaction.timestamp) }}
              </td>
            </tr>
            <tr>
              <td><span>{{$t('explorer.total_output')}}</span></td>
              <td class="balance-line" v-if="transaction.totalOutput">
                {{(transaction.totalOutput).toFixed(8)}} {{crypto}}
                <span class="fiat-from-crypto">
                 {{fiatIcon}} {{calculateFiat.totalSent }}
                </span>
              </td>
            </tr>
          </table>
        </div>
        <div class="transaction-main-info__block">
          <table class="transaction-main-info__block-item-table">
            <tr>
              <td>
                <span>{{$t('explorer.fee')}}</span>
              </td>
              <td class="balance-line">
                {{transaction.fee}} {{crypto}}
              </td>
              <span class="fiat-from-crypto">
                 {{fiatIcon}} {{calculateFiat.totalReceived}}
                </span>
            </tr>
            <tr>
              <td><span>{{$t('explorer.confirmations')}}</span></td>
              <td class="balance-line">
                {{transaction.confirmations}}
              </td>
            </tr>
          </table>
        </div>
        <div class="transaction-main-info__block">
          <table class="transaction-main-info__block-item-table">
            <tr>
              <td>
                <span>{{$t('explorer.size')}}</span>
              </td>
              <td class="balance-line">
                {{transaction.size}} kB
              </td>
            </tr>
            <tr>
              <td><span>{{$t('explorer.version')}}</span></td>
              <td>{{transaction.version}}</td>
            </tr>
            <tr>
              <td><span>{{$t('explorer.fee')}}</span></td>
              <td>{{transaction.fee}}</td>
            </tr>
          </table>
        </div>
      </div>
      <div class="border-top-wrapper">
        <TransactionDetailsDisplayHistory
          v-if="transaction"
          :crypto="crypto"
          :fiat="fiat"
          :inputs="transaction.vin || transaction.input || []"
          :outputs="transaction.vout || transaction.output"
          :getValueInFiat="getValueInFiat"
        />
      </div>
    </div>
  </div>
  <div class="wrapper" v-else>
    <div class="transaction-info " v-if="transaction">
    <div class="transaction-title container">
      <div class="transaction-hash transaction-gray-header-text">
        {{ transaction.hash }}
      </div>
      <button class="copy-button" v-clipboard="transaction.hash || ''" title="copy">
        <svg @click="copyInfo" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="15" height="17" viewBox="0 0 15 17"><defs><path id="cbkqa" d="M987.71 256h9.286v11.607"/><path id="cbkqb" d="M984 271.32v-11.61h9.29v11.61z"/></defs><g><g transform="translate(-983 -255)"><g><use fill="#fff" fill-opacity="0" stroke="#41464a" stroke-miterlimit="50" stroke-width="1.5" xlink:href="#cbkqa"/></g><g><use fill="#fff" fill-opacity="0" stroke="#41464a" stroke-miterlimit="50" stroke-width="1.5" xlink:href="#cbkqb"/></g></g></g></svg>
        <q-tooltip no-parent-event
                   anchor="top middle"
                   self="bottom middle"
                   v-model="showing">
          Copied
        </q-tooltip>
      </button>
    </div>
    <div class="transaction-common-info container">
        <div v-show="isIth && transaction.contractCall" class="eth-contract-inside">
          <span class="eth-contract-text">contract</span>
        </div>
        <div class="transaction-segwit" v-show="transaction.isSegwit">
          <img class="sighwid" src="@/assets/resources/icons/sighwid.svg" alt="sighwid">
          segwit
        </div>
        <div class="transaction-common-info__item" v-if="isLoadTransaction">
          <div :class="['transaction-status', {'transaction-confirmed': transaction.isConfirmed}]">
            <template v-if="transaction.isConfirmed">{{$t('explorer.confirmed')}}</template>
            <template v-else>{{$t('explorer.unconfirmed')}}</template>
          </div>
          <template v-if="transaction.confirmations"  >
            <span v-show="transaction.confirmations === 1">
              {{ transaction.confirmations }} {{$t('explorer.confirmation')}}
            </span>
            <span v-show="transaction.confirmations > 1">
              {{ transaction.confirmations }} {{$t('explorer.confirmations')}}
            </span>
          </template>
        </div>
    </div>
    <div class="transaction-main-info container">
      <div class="transaction-main-info__block">
        <table class="transaction-main-info__block-item-table">
          <tr>
            <td>
              <span>{{$t('explorer.date')}}</span>
            </td>
            <td colspan="2">
             {{(transaction.blockTimestamp || transaction.date || transaction.timestamp || transaction.time || '') | formatDate }}
            </td>
          </tr>
          <tr>

            <td>
              <span>{{$t('explorer.total_output')}}</span>
            </td>
            <td class="balance-line">
              <span>
                {{transaction.valueVout || transaction.valueETH || ''}} {{crypto}}
              </span>
              <span class="fiat-from-crypto">
                 {{fiatIcon}} {{calculateFiat.totalSent}}
              </span>
            </td>
          </tr>
          <tr v-show="isIth">
            <td><span>{{$t('explorer.gas_limit')}}</span></td>
            <td class="balance-line">
              {{transaction.gasLimit || ''}} {{crypto}}
            </td>
          </tr>
        </table>
        <div v-if="showAdvancedFunctions" class="setting-checkbox-wrap">
          <div class="setting-checkbox">
            {{$t('explorer.advanced_view')}}
            <div v-tooltip="$t('explorer.display_address_inputs')" class="ask">!</div>
          </div>
            <CheckBox
              class="transaction-display-history__checkbox"
              id="advanced-view"
              :val="isAdvancedView"
              :changeFunc="handleAdvancedView"
            />
        </div>
      </div>
      <div class="transaction-main-info__block">
        <table class="transaction-main-info__block-item-table">
          <tr>
            <td>
              <span>{{$t('explorer.fee')}}</span>
            </td>
              <td class="balance-line">
                {{transaction.fee || '0'}} {{crypto}}
                <span class="fiat-from-crypto">
                 {{fiatIcon}} {{calculateFiat.totalReceived || '0.00'}}
                </span>
              </td>
          </tr>
          <tr>
            <td><span>{{$t('explorer.current_value')}}</span></td>
            <td class="balance-line">
              {{transaction.valueVin || transaction.valueETH || '0'}} {{crypto}}
              <span class="fiat-from-crypto">
                 {{fiatIcon}} {{calculateFiat.currentBalance}}
                </span>
            </td>
          </tr>
          <tr v-show="isIth">
            <td><span>{{$t('explorer.gas_used_by_transaction')}}</span></td>
            <td class="balance-line">
              {{transaction.gasUsed || '-'}} ({{transaction.gasUsedPercent || '-'}}%)
            </td>
          </tr>
        </table>
        <div v-if="showAdvancedFunctions" class="setting-checkbox-wrap">
          <div class="setting-checkbox">
            {{scriptHandlerText}}
            <span class="ask" v-tooltip.hover="$t('explorer.transaction_details_display_history_tooltip')">!</span>
          </div>
            <CheckBox
              class="transaction-display-history__checkbox"
              id="show-script"
              :val="isShowScript"
              :changeFunc="handleShowScript"
            />
        </div>
      </div>
      <div class="transaction-main-info__block">
        <table class="transaction-main-info__block-item-table">
          <tr>
            <td>
              <span>{{$t('explorer.block')}}</span>
            </td>
            <td>
                <router-link v-if="transaction.blockHeight !=='Undetermined'" class="block-link" :to="{path: `/${crypto.toLowerCase()}/block/${transaction.blockHeight}`}">{{transaction.blockHeight || '-'}}</router-link>
                <div v-else class="block-link transaction-status">{{transaction.blockHeight.toLowerCase() || '-'}}</div>
            </td>
          </tr>
          <tr>
            <td><span>{{$t('explorer.size')}}</span></td>
            <td>{{transaction.size || '-'}} kB</td>
          </tr>
          <tr v-show="isIth">
            <td>
              <span>{{$t('explorer.gas_price')}}</span>
            </td>
            <td>{{transaction.gasPriceEth || ''}} ({{transaction.gasPriceGwei || '-'}} Gwei)</td>
          </tr>
        </table>
      </div>
    </div>
    <div class="border-top-wrapper">
      <TransactionDetailsDisplayHistory
        v-if="transaction"
        :crypto="crypto"
        :fiat="fiat"
        :inputs="transaction.vin || transaction.input || []"
        :outputs="transaction.vout || transaction.output"
        :outputsCount="transaction.valueETH || ''"
        :getValueInFiat="getValueInFiat"
        :isAdvancedView ="isAdvancedView"
        :isShowScript="isShowScript"
        :showBullet="showBullet"
        :hash="hash"
      />
    </div>
  </div>
  </div>
</template>
<script>
import fiatSignMixin from '../../../mixins/fiatSignMixin'
import TransactionDetailsDisplayHistory from './TransactionDetailsDisplayHistory'
import getValueInFiatMixin from '../../../mixins/getValueInFiatMixin'
import CheckBox from '../../commonUI/CheckBox'
import moment from 'moment'

export default {
  name: 'TransactionDetailsDisplay',
  components: { TransactionDetailsDisplayHistory, CheckBox },
  props: {
    transaction: {
      required: true,
      type: Object
    },
    hash: {
      required: true,
      type: String
    }
  },
  data () {
    return {
      showing: false,
      isShowScript: false,
      isAdvancedView: false,
      showBullet: false
    }
  },
  mixins: [fiatSignMixin, getValueInFiatMixin],
  methods: {
    copyInfo () {
      this.showing = true
      setTimeout(() => {
        this.showing = false
      }, 1000)
    },
    formatFiat (fiat) {
      return +fiat.toFixed(2)
    },
    handleShowScript () {
      this.isShowScript = !this.isShowScript
    },
    handleAdvancedView () {
      this.showBullet = !this.showBullet
      this.isAdvancedView = !this.isAdvancedView
    },
    getTime (time) {
      return moment.unix(time).format('MMMM DD, YYYY, hh:mm:ss, A')
    }
  },
  computed: {
    isIth () {
      return this.crypto === 'ETH'
    },
    scriptHandlerText () {
      return this.isShowScript ? this.$t('transaction_history.hide_script') : this.$t('transaction_history.show_script')
    },
    showAdvancedFunctions () {
      return this.crypto !== 'ETH' && this.crypto !== 'XMR'
    },
    isLoadTransaction () {
      return this.transaction.hash
    },
    calculateFiat () {
      if (this.fiatRate) {
        return {
          totalSent: ((this.transaction.valueVout || this.transaction.valueETH || this.transaction.totalOutput || '') * this.fiatRate).toLocaleString('en-EN',
            { minimumFractionDigits: 2,
              maximumFractionDigits: 2 }),
          totalReceived: ((this.transaction.fee * this.fiatRate) || '').toLocaleString('en-EN',
            { minimumFractionDigits: 2,
              maximumFractionDigits: 2 }),
          currentBalance: ((this.transaction.valueVin || this.transaction.valueETH || '') * this.fiatRate).toLocaleString('en-EN',
            { minimumFractionDigits: 2,
              maximumFractionDigits: 2 })
        }
      }
      return {
        totalSent: 'N/A',
        totalReceived: 'N/A',
        currentBalance: 'N/A'
      }
    },
    fiatRate () {
      return this.rate[this.crypto] && this.rate[this.crypto].Value
    }
  }
}
</script>
<style scoped lang="scss">
  .setting-checkbox{
    display: flex;
    align-items: center;
  }

  .transaction-title{
    color: #41464a;
    font-size: 18px;
    font-weight: 500;
    padding: 0;
    margin-bottom: 15px;
    justify-content: flex-start;
  }

  .transaction-common-info{
    display: flex;
    color: #41464a;
    font-size: 15px;
    font-weight: 500;
    letter-spacing: -0.11px;
  }

  .transaction-segwit{
    margin-right: 20px;
    display: flex;
    align-items: center;
    .sighwid{
      height: 24px;
      width: auto;
      margin-right: 10px;
    }
  }

  .transaction-info-content {
    padding-top: 9px;
    overflow: auto;
    height: 100%;
    margin-top: -4px;
  }

  .padding-five-px {
    padding: 5px;
  }

  .transaction-output-details{
    height: auto;
    display: flex;
  }

  .transaction-output-details a {
    color: #2e2637;
  }

  .transaction-output-details a:hover {
    text-decoration: underline !important;
  }

  .border-top-wrapper{
    padding-top: 20px;
    margin-top: 8px;
  }
  .eth-contract-inside {
    display: flex;
    color: #41464a;
    font-size: 15px;
    font-weight: 500;
    letter-spacing: -0.11px;
    .eth-contract-text{
      color: #fff;
      font-size: 15px;
      font-weight: 500;
      background-color: #427091;
      padding: 5px 10px;
      display: inline-block;
      border-radius: 3px;
      margin-right: 7px;
    }
  }
</style>
