<template>
  <div class="statistic-coin-line">
    <div class="statistic-coin-line__title">
      <CollorCurrencySvgs
        class="statistic-coin-line__icon"
        :currency="currency"
      />
      <span class="statistic-coin-line__name">
        {{currencyName}}
      </span>
    </div>
    <slot></slot>
  </div>
</template>
<script>
import CollorCurrencySvgs from '../commonUI/CollorCurrencySvgs'
import { COINS_NAMES } from '../../constants/coinsMap'
export default {
  name: 'StatisticCoinLine',
  components: { CollorCurrencySvgs },
  props: {
    currency: {
      type: String,
      required: true
    }
  },
  computed: {
    currencyName () {
      return COINS_NAMES[this.currency]
    }
  }
}
</script>

<style lang="scss">
  .statistic-coin-line{
    width: 100%;
    display: flex;
    align-items: center;
    margin-bottom: 12px;
  }
  .statistic-coin-line__title{
    display: flex;
    align-items: center;
    min-width: 140px;
    width: 140px;
    height: 40px;
    padding: 10px 12px;
    color: #41464a;
    font-size: 15px;
    font-weight: 500;
    letter-spacing: -0.11px;
    background-color: #f6f6f6;
    border-radius: 5px;
  }
  .statistic-coin-line__name{
    margin-left: 10px;
  }
  .statistic-coin-line__icon{
    display: flex;
    align-items: center;
  }
</style>
