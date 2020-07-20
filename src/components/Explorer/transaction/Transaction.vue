<template>
  <div v-if="crypto === 'XMR'">
    <div class="transaction-info" v-if="transaction">
      <div class="transaction-title transaction-title_hash">
        <div class="transaction-hash">
          <span
            v-tooltip.hover="transaction.isConfirmed ? 'confirmed' : 'unconfirmed'"
            :class="['transaction-status-indicator', {'confirmed': transaction.isConfirmed}]">
          </span>
          <router-link
            class="transaction-hash-link"
            :to="{path: `/${crypto.toLowerCase()}/transaction/${transaction.hash}`}"
          >
            {{transaction.hash}}
            <img class="sighwid" v-tooltip.hover="$t('explorer.transaction_tooltip')" v-show="transaction.isSegwit"
                 src="@/assets/resources/icons/sighwid.svg" alt="sighwid">
          </router-link>
          <span v-show="transaction.contractCall" class="contract">{{transactionContract[transaction.contractCall] || ''}}</span>
        </div>
      </div>
      <div class="transaction-counts-info">
        <div class="transaction-title transaction-title_fees">
          <div class="transaction-hash">
            {{(transaction.fee) || $t('xrp_text.na')}}
          </div>
        </div>
        <div class="transaction-title transaction-title_out">
          <div class="transaction-hash">
            {{(transaction.outputs).toFixed(4) || $t('xrp_text.na')}}
          </div>
        </div>
        <div class="transaction-title transaction-title_size">
          <div class="transaction-hash">
            {{(transaction.size).toFixed(2)}}
          </div>
        </div>
      </div>

    </div>
  </div>
  <div class="wrapper" v-else>
    <div class="transaction-info"
         v-if="transaction"
    >
      <div class="transaction-title">
        <div class="transaction-hash">
        <span
          v-tooltip.hover="transaction.isConfirmed ? 'confirmed' : 'unconfirmed'"
          :class="['transaction-status-indicator', {'confirmed': transaction.isConfirmed}]">
        </span>
          <router-link
            class="transaction-hash-link"
            :to="{path: `/${crypto.toLowerCase()}/transaction/${transaction.hash}`}"
          >
            {{transaction.hash}}
            <div v-show="transaction.isMempool"
                 class="q-ml-md mempool-bg"
                 style="margin-left: 16px; display: flex"
            >
              <img class="q-mx-sm mempool-icon"
                   style="margin-left: 8px; margin-right: 8px"
                   src="@/assets/resources/icons/mempoolicon.svg"
                   alt="mempool"
              >
            </div>
            <img class="sighwid" v-tooltip.hover="$t('explorer.transaction_tooltip')" v-show="transaction.isSegwit"
                 src="@/assets/resources/icons/sighwid.svg" alt="sighwid">
          </router-link>
          <span v-show="transaction.contractCall" class="eth-contract">{{$t('explorer.contract')}}</span>
        </div>
      </div>
      <div class="transaction-content">
        <div
          class="amount amount-crypto">
          {{getFixedCount(transaction.value || transaction.vout)}}
        </div>
        <div v-if="this.transaction.vout || transaction.value" class="amount amount-fiat">
          {{rateFiatToCrypto}}
        </div>
        <div v-else class="amount amount-fiat">
          {{$t('xrp_text.na')}}
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import getValueInFiatMixin from '../../../mixins/getValueInFiatMixin'
  import moment from 'moment'

  export default {
    name: 'Transaction',
    mixins: [getValueInFiatMixin],
    computed: {
      crypto() {
        return this.$store.getters['crypto']
      },
      rateFiatToCrypto() {
        if (this.$store.getters.rate[this.crypto]) {
          return ((this.transaction.vout || this.transaction.value) * +this.$store.getters.rate[this.crypto].Value).toFixed(2) || 'N/A'
        } else {
          return 'N/A'
        }
      }
    },
    props: {
      transaction: {
        type: Object,
        required: true
      }
    },
    data() {
      return {
        transactionContract: {
          'true': 'Contract'
        }
      }
    },
    methods: {
      getTime(time) {
        return moment.unix(time).format('HH:mm:ss')
      },
      getFixedCount(data) {
        if (data) {
          return this.crypto === 'ETH' ? data : data.toFixed(8)
        } else {
          return 'N/A'
        }
      }
    }
  }
</script>
<style scoped lang="scss">
  .transaction-status-indicator {
    display: inline-block;
    width: 5px;
    height: 5px;
    border-radius: 100px;
    background-color: #ffdc7c;

    &.confirmed {
      background-color: #ebecec;
    }
  }

  .transaction-info {
    display: flex;
    justify-content: space-between;
    background-color: #ffffff;
    margin-bottom: 0;
    font-size: 15px;
    line-height: 17px;
    height: 40px;

    &:nth-child(2n) {
      background-color: #f6f6f6;
    }
  }

  .transaction-content {
    display: flex;
    justify-content: flex-end;
  }

  .transaction-title {
    border: none;
    background-color: transparent;
  }

  .transaction-title {
    margin-bottom: 0;
  }

  .transaction-hash {
    display: flex;
    align-items: center;

    .transaction-status-indicator {
      margin-right: 20px;
    }

    .transaction-hash-link {
      color: #41464a;
      cursor: pointer;
      display: flex;

      .mempool-bg {
        background-color: #09b66d;
        border-radius: 5px;
        height: 18px;
        .mempool-icon{
          width: 15px;
        }
      }

      .sighwid {
        height: 17px;
        width: auto;
        margin-left: 10px;
        opacity: 0.4;
        transition: .4s opacity;

        &:hover {
          opacity: 1;
        }
      }

      &:hover {
        text-decoration: underline !important;
      }
    }
  }

  .transaction-content {
    padding-right: 18px;

    .amount {
      padding: 0;
      border: none;
      background-color: transparent;
      min-width: 150px;
      justify-content: flex-end;

      &.amount-crypto {
        min-width: 250px;
      }
    }
  }

  .transaction-content {
    width: 300px;
  }

  .transaction-title.transaction-title_hash {
    width: 700px;
  }

  .transaction-title_fees, .transaction-title_out, .transaction-title_size {
    width: 100px;
  }

  .transaction-counts-info {
    display: flex;

    .transaction-title {
      width: 120px;
      padding: 10px 20px;
    }
  }
</style>
