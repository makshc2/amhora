<template>
  <div class="transaction-display-history container" v-if="crypto === 'XMR'">
    <TransactionInfo
      :crypto ="crypto"
      :fiat ="fiat"
      :inputs ="inputs"
      :outputs ="outputs"
      :getValueInFiat ="getValueInFiat"
    />
  </div>
  <div class="transaction-display-history" v-else>
    <div
      v-show="isShowScript"
      class="transaction-display-history-scripts">
      <div class="flex row justify-center items-start align-top">
        <div class="script">
          <h2>Input script <span class="top"></span></h2>
          <p v-for="(item, index) in script.inputs" :key="index">{{item}}</p>
        </div>
        <div class="script">
          <h2>Output script <span class="bottom"></span></h2>
          <p v-for="(item, index) in script.outputs" :key="index">{{item}}</p>
        </div>
      </div>
    </div>
    <div class="container">
      <TransactionInfo
        :isAdvancedView ="isAdvancedView"
        :showBullet = "showBullet"
        :crypto ="crypto"
        :fiat ="fiat"
        :inputs ="inputs"
        :outputs ="outputs"
        :getValueInFiat ="getValueInFiat"
        :outputsCount = "outputsCount"
      />
    </div>
  </div>
</template>

<script>
import TransactionInfo from './TransactionInfo'
import { GET_TRANSACTION_SCRIPT, GET_MEMPOOL_SCRIPT } from '@/services/requests'
import { parseCryptoForRequests } from '@/mocks/route-crypto-parser'
export default {
  name: 'TransactionDetailsDisplayHistory',
  components: { TransactionInfo },
  data () {
    return {
      script: {}
    }
  },
  methods: {
    async getScriptInfo () {
      if (this.$route.name === 'TransactionDetails') {
        this.script = await GET_TRANSACTION_SCRIPT({ crypto: parseCryptoForRequests[this.crypto], hash: this.hash })
      } else {
        this.script = await GET_MEMPOOL_SCRIPT({ crypto: parseCryptoForRequests[this.crypto], hash: this.hash })
      }
    }
  },
  props: {
    outputsCount: {
      type: String
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
      type: Function
    },
    hash: String,
    isAdvancedView: Boolean,
    isShowScript: Boolean,
    showBullet: Boolean
  },
  computed: {
    scriptHandlerText () {
      return this.isShowScript ? this.$t('transaction_history.hide_script') : this.$t('transaction_history.show_script')
    }
  },
  watch: {
    isShowScript () {
      if (this.isShowScript) {
        this.getScriptInfo()
      }
    }
  }
}
</script>

<style scoped lang="scss">
  .transaction-display-history{
    display: flex;
    flex-direction: column;
  }
 .transaction-display-history__header-settings{
   display: flex;
   justify-content: space-between;
   align-items: center;
   padding: 20px 0;
 }
 .transaction-display-history__header-setting{
   display: flex;
   align-items: center;
   color: #41464a;
   font-size: 15px;
   font-family: "Avenir Next Cyr Demi", sans-serif;
 }
  .transaction-display-history__checkbox{
    padding-right: 20px;
  }

  .ask{
    margin-left: 20px;
  }
  .transaction-display-history__header-handler{
    padding: 5px 0;
    border: none;
    color: #41464a;
    font-size: 15px;
    font-family: "Avenir Next Cyr Demi", sans-serif;
    letter-spacing: -0.11px;
    border-bottom: 2px dotted #41464a;
    background-color: transparent;
    cursor: pointer;
  }
  .transaction-display-history-scripts{
    width: 100%;
    background-color: #d8d8d840;
    padding: 20px 0;
    margin-bottom: 20px;
  }
  .script{
    width: 35%;
    &:first-child{
      margin-right: 80px;
    }
    h2{
      font-weight: 500;
      display: flex;
      align-items: center;
      margin-bottom: 30px;
      font-size: 20px;
      span{
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 11px;
        margin-left: 15px;
        height: 20px;
        width: 20px;
        border: 1px solid #d0d0d0;
        border-radius: 5px;
        font-weight: 900;
        font-style: normal;
        &.bottom:before{
          content: '⬆';
        }
        &.top:before{
          content: '⬇';
        }
        &:before{
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }
      }
    }
    p{
      margin-bottom: 20px;
      line-height: 1.6;
      white-space: pre-wrap;
      word-wrap: break-word;
    }
  }
</style>
