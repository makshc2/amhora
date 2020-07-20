<template>
  <nav class="statistic-navigation">
    <ul class="statistic-navigation__list">
      <li class="statistic-navigation__item">
        <router-link class="static-navigation__link" to="/statistics/transactions">{{$t('statistic.txs')}}</router-link>
      </li>
      <li class="statistic-navigation__item">
        <router-link class="static-navigation__link" to="/statistics/transaction-value">{{$t('statistic.transaction_value')}}</router-link>
      </li>
      <li class="statistic-navigation__item">
        <router-link class="static-navigation__link" to="/statistics/blocks">{{$t('statistic.blocks')}}</router-link>
      </li>
      <li class="statistic-navigation__item">
        <router-link class="static-navigation__link" to="/statistics/difficulty">{{$t('statistic.difficulty')}}</router-link>
      </li>
      <li class="statistic-navigation__item">
        <router-link class="static-navigation__link" to="/statistics/hashrate">{{$t('statistic.hashrate')}}</router-link>
      </li>
      <li class="statistic-navigation__item">
        <router-link class="static-navigation__link" to="/statistics/mining-profitability">{{$t('statistic.mining_profitability')}}</router-link>
      </li>
    </ul>
  </nav>
</template>
<script>
export default {
  name: 'StatisticNavigation'
}
</script>
