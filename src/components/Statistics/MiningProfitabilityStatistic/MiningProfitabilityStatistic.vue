<template>
  <div>
    <vue-headful
      :title="title"
      :description="description"
    />
    <TransactionStatistics></TransactionStatistics>
  </div>
</template>
<script>
import TransactionStatistics from '../TransactionStatistic/TransactionStatistic'

export default {
  name: 'MiningStatistic',
  components: { TransactionStatistics },
  computed: {
    loading () {
      return this.$store.state.statistic.loading
    },
    statistic () {
      return this.$store.state.statistic.data
    },
    title () {
      return 'Mining Profitibility'
    },
    description () {
      return 'Find period based statistical data consolidated from several sources'
    }
  },
  methods: {
    getData (value, precision) {
      precision = precision || 0
      return value ? value.formatMoney(precision, '.', ',') : 'N/A'
    }
  }
}
</script>
