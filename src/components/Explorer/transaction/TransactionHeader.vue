<template>
  <div
    class="tx-header"
    :class="{ 'tx-header_green': transaction.totalOutput > 0,
              'tx-header_red': transaction.totalOutput < 0,
              'tx-header_yellow': !transaction.totalOutput
            }"
  >
    <router-link :to="{path: `/${crypto.toLowerCase()}/transaction/${transaction.hash}`}">
      {{transaction.hash}}
    </router-link>
    <span
      :class="['transaction-status', {'transaction-confirmed': transaction.isConfirmed}]"
      v-if="!transaction.isConfirmed"
    >
      <template>{{$t('explorer.unconfirmed')}}</template>
    </span>
    <span class="tx-header-date">
       <template v-show="transaction.timestamp || transaction.record.blocktime">{{(transaction.timestamp || transaction.record.blocktime) | formatDate}}</template>
    </span>
  </div>
</template>
<script>
export default {
  name: 'TransactionHeader',
  props: {
    transaction: {
      type: Object,
      default: () => {}
    },
    crypto: {
      type: String,
      default: ''
    },
    headerColor: {
      type: String,
      default: ''
    }
  }
}
</script>

<style scoped lang="scss">
  .tx-header{
    height: 40px;
    width: 100%;
    padding: 0 20px;
    display: flex;
    align-items: center;
    background-color: #f6f6f6;
    font-size: 15px;
    font-weight: 500;
    letter-spacing: 0.21px;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    a{
      color: #41464a;
      &:hover{
        text-decoration: underline!important;
      }
    }
    &.tx-header_green{
      background-color: #09b66d10;
    }
    &.tx-header_red{
      background-color: #dd4e4110;
    }
    &.tx-header_yellow{
      background-color: #fbe3a110;
    }
  }
  .tx-header-date{
    margin-left: auto;
  }

  .transaction-status{
    margin-left: 12px;
    border-radius: 3px;
  }
</style>
