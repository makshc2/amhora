<template>
  <table class="table-sm live-order">
    <thead class="table-sm-header">
    <tr>
      <td>{{$t('market_trades_table.time')}}</td>
      <td>{{$t('market_trades_table.amount')}}</td>
      <td>{{$t('market_trades_table.price')}} {{fiat}}</td>
      <td>{{$t('market_trades_table.amount')}} {{fiat}}</td>
    </tr>
    </thead>
    <tbody v-if="data"
      class="table-sm-body">
    <tr
      v-for="(item, key, i) in data.data"
      :key="i"
    >
      <td>
        <span :class="`order-type order-type_${data.ordersType}`">{{$t(`market_live_order.${data.ordersType}`) | capitalize}}</span >
      </td>
      <td>{{(+item.amount).toFixed(4)}}</td>
      <td>{{(+item.price).toFixed(2)}}</td>
      <td>{{(+item.amount * +item.price).toFixed(2)}}</td>
    </tr>
    </tbody>
  </table>
</template>
<script>
import getValueInFiatMixin from '../../mixins/getValueInFiatMixin'

export default {
  name: 'MarketLiveOrderTable',
  mixins: [getValueInFiatMixin],
  props: {
    data: {
      ordersType: Array,
      default: () => []
    }
  }
}
</script>
<style scoped>
  .live-order tr td:nth-child(2){
    min-width: 160px;
  }
  .live-order tr td:nth-child(4){
    min-width: 120px;
  }
</style>
