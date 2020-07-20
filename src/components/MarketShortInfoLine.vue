<template>
  <div class="line-rate">
    <div class="left-info">
      <CurrencyesSvgs class="left-info-icons" :currency="name.toUpperCase()"/>
      <div class="left-info-currancy">{{name}}</div>
      <div class="left-info-currancy-rate">{{(+currencyInfo.Value).toFixed(2)}}</div>
      <div class="left-info-currancy-procent-wrapper"><span :class="['left-info-currancy-procent', {active: +currencyInfo.Percentage > 0}]">
        {{(+currencyInfo.Percentage).toFixed(2)}}%
      </span></div>
    </div>
  </div>
</template>

<script>
import CurrencyesSvgs from './commonUI/CurrencyesSvgs'
export default {
  name: 'MarketShortInfoLine',
  components: { CurrencyesSvgs },
  props: {
    currencyInfo: {
      type: Object,
      required: true
    },
    fiat: {
      type: String,
      required: true
    },
    range: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    }
  }
}
</script>
