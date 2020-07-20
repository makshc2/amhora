<template>
  <div class="all-transactions">
    <div class="wrapper-crypto" v-if="crypto === 'XMR'">
      <div class="transactions-header xmr-table-header">
        <div class="transactions-header-item transactions-header-item_hash">{{$t('explorer.transaction_id')}}</div>
        <div class="tittle-header-counts">
          <div class="transactions-header-item transactions-header-item_fees">{{$t('explorer.fee')}}</div>
          <div class="transactions-header-item transactions-header-item_out">{{$t('explorer.output')}}</div>
          <div class="transactions-header-item transactions-header-item_size">{{$t('explorer.size')}} (kB)</div>
        </div>
      </div>
      <div class="transactions-body">
        <transaction
          v-for="(item, index) in transactions"
          :key="`${index}-${item}`"
          :transaction="item"
          :crypto="crypto"
          :class="index%2 === 1 ? 'child':''"
          :id="item.hash"
          :status="item.status"
        />
      </div>
    </div>
    <div class="wrapper-crypto" v-else>
      <div class="transactions-header">
        <div class="transactions-header-item transactions-header-item_hash">{{$t('explorer.transaction_id')}}</div>
        <div class="transactions-header-item transactions-header-item_crypto">{{$t('explorer.output')}} <span> {{crypto}}</span>
        </div>
        <div class="transactions-header-item transactions-header-item_fiat">{{$t('explorer.output')}}
          <span> {{fiat}}</span></div>
      </div>
      <div class="transactions-body">
        <template v-for="(item, index) in transactions">
        <transaction
          v-if="item"
          :key="`${index}-${item}`"
          :class="index%2 === 1 ? 'child':''"
          :transaction="item"
          :crypto="crypto"
          :id="item.hash"
          :status="item.status"
        />
        </template>
      </div>
    </div>
  </div>
</template>
<script>
import Transaction from './transaction/Transaction.vue'

export default {
  name: 'AllTransactions',
  components: {
    Transaction
  },
  props: {
    transactions: {
      type: Array,
      required: true
    }
  },
  computed: {
    crypto () {
      return this.$store.getters.crypto
    },
    fiat () {
      return this.$store.getters.fiat
    }
  }
}
</script>
<style scoped lang="scss">
  .all-transactions {
    width: 100%;
    display: flex;
    flex-direction: column;
  }

  .transactions-body {
    overflow-y: auto;
    display: flex;
    flex-direction: column-reverse;
  }

  .fade-enter-active,
  .fade-leave-active {
    -webkit-transition: all .5s ease;
    transition: all .5s ease;
  }

  .fade-enter,
  .fade-leave-to {
    opacity: 0;
  }

  .fade-move {
    -webkit-transition: -webkit-transform .5s;
    transition: -webkit-transform .5s;
    transition: transform .5s, -webkit-transform .5s;
  }

  .transactions-header {
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    flex-shrink: 0;
    padding: 0 18px;
    font-size: 13px;
    letter-spacing: 0.2px;
    height: 35px;
    width: 100%;
    display: flex;
    align-items: center;
    background-color: #f6f6f6;

    &.xmr-table-header {
      padding-right: 0 !important;
    }

    .transactions-header-item {
      span {
        color: rgba(65, 70, 74, 0.5);
        margin-left: 4px;
      }

      &.transactions-header-item_hash {
        margin-left: 10px;
        margin-right: auto;
      }

      &.transactions-header-item_crypto {
        min-width: 250px;
        display: flex;
        justify-content: flex-end;
      }

      &.transactions-header-item_fiat {
        min-width: 150px;
        display: flex;
        justify-content: flex-end;
      }
    }

    .tittle-header-counts {
      display: flex;

      .transactions-header-item {
        width: 120px;
        padding: 10px 20px;
      }
    }
  }
</style>
