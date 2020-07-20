<template>
  <div class="transaction-main-info container">
    <div class="transaction-main-info__block">
      <table class="transaction-main-info__block-item-table">
        <tr>
          <td>
            <span>{{$t('address_info.current_value')}}</span>
          </td>
          <td class="balance-line">
            {{(parsedAddressInformation.totalReceived - parsedAddressInformation.totalSent).toFixed(8)}} {{crypto}}
            <span class="fiat-from-crypto fiat-from-crypto-green">
                 {{fiatIcon}} {{calculateFiat.currentBalance}}
            </span>
          </td>
        </tr>
        <tr>
          <td>
            <span>{{$t('address_info.last_used')}}</span>
          </td>
          <td class="txs-count">
            {{lastUsed | formatDate}}
          </td>
        </tr>
      </table>
    </div>
    <div class="transaction-main-info__block">
      <table class="transaction-main-info__block-item-table">
        <tr>
          <td>
            <span>{{$t('explorer.total_output')}}</span>
          </td>
            <td class="balance-line">
              {{(parsedAddressInformation.totalSent).toFixed(8)}} {{crypto}}

              <span class="fiat-from-crypto">
                 {{fiatIcon}} {{calculateFiat.totalSent}}
            </span>
            </td>
        </tr>
        <tr>
          <td>
            <span>{{$t('address_info.total_received')}}</span>
          </td>
          <td class="balance-line">
            {{(parsedAddressInformation.totalReceived).toFixed(8)}} {{crypto}}

            <span class="fiat-from-crypto">
              {{fiatIcon}} {{calculateFiat.totalReceived}}
            </span>
          </td>
        </tr>
      </table>
    </div>
    <div class="transaction_count_wrapper">
      <table class="transaction-main-info__block-item-table">
        <tr>
          <td>
            <span>{{$t('address_info.transactions_count')}}</span>
          </td>
          <td class="txs-count">
            {{parsedAddressInformation.txsCount}}
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>
<script>
import getValueInFiatMixin from '../../../mixins/getValueInFiatMixin'
import { parseCryptoForRequests } from '../../../mocks/route-crypto-parser'
import {
  GET_LAST_TRANSACTION
} from '../../../services/requests'
export default {
  name: 'AddressMainInfo',
  mixins: [getValueInFiatMixin],
  props: {
    parsedAddressInformation: {
      type: Object,
      required: true,
      default () {
        return {}
      }
    }
  },
  data () {
    return{
      lastUsed:'',
      lastTransaction:'',
      transactionDate:''
    }
  },
  computed: {
    calculateFiat () {
      if (this.fiatRate) {
        return {
          totalSent: (this.parsedAddressInformation.totalSent * this.fiatRate).toLocaleString('en-EN',
            {minimumFractionDigits: 2,
            maximumFractionDigits: 2}),
          totalReceived: (this.parsedAddressInformation.totalReceived * this.fiatRate).toLocaleString('en-EN',
            {minimumFractionDigits: 2,
            maximumFractionDigits: 2}),
          currentBalance: (this.parsedAddressInformation.currentBalance * this.fiatRate).toLocaleString('en-EN',
            {minimumFractionDigits: 2,
            maximumFractionDigits: 2})
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
  },
  methods:{
    getLastTransaction () {
      GET_LAST_TRANSACTION ({crypto: parseCryptoForRequests[this.crypto], hash: this.parsedAddressInformation.address})
        .then(resp => {
          if(resp.lastUsed !== 0){
            this.lastUsed = resp.lastUsed
          } else {
            this.lastUsed = this.parsedAddressInformation.lastUsed
          }
        })
    }
  },
  mounted() {
    this.lastUsed = this.parsedAddressInformation.lastUsed
    this.lastTransaction = setInterval(()=>{
      this.getLastTransaction ()
    }, 5000)
  },
  beforeDestroy() {
    clearInterval(this.lastTransaction)
  }
}
</script>
<style scoped lang="scss">
  .transaction_count_wrapper{
    padding: 0 30px;
    width: 40%;
  }
  .txs-count{
    padding-left: 10px;
  }
</style>
