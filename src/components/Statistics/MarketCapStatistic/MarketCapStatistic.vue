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
  name: 'MarketCapStatistic',
  components: {
    TransactionStatistics
  },
  computed: {
    title () {
      return 'Marketcap'
    },
    description () {
      return 'Find period based statistical data consolidated from several sources'
    }
  }
}
</script>
