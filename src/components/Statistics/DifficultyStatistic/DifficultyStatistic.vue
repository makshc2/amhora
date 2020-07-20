<template>
  <div>
    <vue-headful
      :title="title"
      :description="description"
    />
    <TransactionStatistics></TransactionStatistics>
    <!--<template v-if="Object.keys(statistic).length">-->
      <!--<StatisticCoinLine-->
        <!--v-for="(item,key,i) in statistic"-->
        <!--:currency="key"-->
        <!--:key="i"-->
      <!--&gt;-->
        <!--<template>-->
          <!--<span class="created-text">-->
            <!--{{item['difficulty']}}-->
          <!--</span>-->
        <!--</template>-->
      <!--</StatisticCoinLine>-->
    <!--</template>-->
    <!--<template v-else>-->
      <!--<template v-if="loading">-->
        <!--<MoonLoader color="#b0becb"/>-->
      <!--</template>-->
      <!--<template v-else>-->
        <!--Error. Statistic not found-->
      <!--</template>-->
    <!--</template>-->
  </div>
</template>

<script>
import TransactionStatistics from '../TransactionStatistic/TransactionStatistic'
export default {
  name: 'DifficultyStatistic',
  components: { TransactionStatistics },
  computed: {
    loading () {
      return this.$store.state.statistic.loading
    },
    statistic () {
      return this.$store.state.statistic.data
    },
    title () {
      return 'Difficulty'
    },
    description () {
      return 'Find period based statistical data consolidated from several sources'
    }
  }
}
</script>
