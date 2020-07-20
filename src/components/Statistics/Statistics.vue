<template>
  <div class="statistic-page">
    <vue-headful
      :title="title"
      :description="description"
    />
    <StatisticNavigation />
    <div class="statistic-content">
      <StatisticBlockHeader />
      <router-view :key="$route.path"></router-view>
    </div>
  </div>
</template>
<script>

import StatisticNavigation from './StatisticNavigation'
import StatisticBlockHeader from './StatisticBlockHeader'

export default {
  name: 'Statistics',
  components: { StatisticBlockHeader, StatisticNavigation },
  computed: {
    cryptoTitle () {
      return this.$store.getters.currencyButtons
    },
    title () {
      return 'Transactions'
    },
    description () {
      return 'Find period based statistical data consolidated from several sources'
    }
  },
  beforeRouteLeave (to, from, next) {
    this.$store.commit('SET_STATISTIC_NEW_DATE', new Date(Date.now() - 24 * 3600 * 1000))
    next()
  }
}
</script>
