<template>
  <table class="table-sm">
    <thead class="table-sm-header">
    <tr>
      <td>{{$t('market_trades_table.amount')}}</td>
      <td>{{$t('market_trades_table.price')}} {{fiat}}</td>
      <td>{{$t('market_trades_table.amount')}} {{fiat}}</td>
      <td>{{$t('market_trades_table.time')}}</td>
    </tr>
    </thead>
    <tbody v-if="this.$store.getters['getCentrifugeConnection']" class="table-sm-body">
    <tr
      v-for="(item, key) in data"
      :key="key"
    >
      <td>{{item.amount.toFixed(8)}}</td>
      <td>{{item.price.toFixed(2)}}</td>
      <td>{{(item.amount*item.price).toFixed(2)}}</td>
      <td>{{item.timestamp | timeOnly}}</td>
    </tr>
    </tbody>
  </table>
</template>
<script>
import getValueInFiatMixin from '../../mixins/getValueInFiatMixin'
import moment from 'moment'
export default {
  name: 'MarketTradesTable',
  mixins: [getValueInFiatMixin],
  props: {
    data: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    getTime (time) {
      return moment.unix(time).format('hh:mm:ss, A')
    }
  }
}
</script>
