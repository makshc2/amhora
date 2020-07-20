import TransactionStatistics from '../components/Statistics/TransactionStatistic/TransactionStatistic'
import MarketCapStatistics from '../components/Statistics/MarketCapStatistic/MarketCapStatistic'
import TransactionValueStatistic from '../components/Statistics/TransactionValueStatistic/TransactionValueStatistic'
import BlocksStatistic from '../components/Statistics/BlocksStatistic/BlocksStatistic'
import DifficultyStatistic from '../components/Statistics/DifficultyStatistic/DifficultyStatistic'
import HashrateStatistic from '../components/Statistics/HashrateStatistic/HashrateStatistic'
import MiningProfitabilityStatistic from '../components/Statistics/MiningProfitabilityStatistic/MiningProfitabilityStatistic'

export default [
  {
    path: 'transactions',
    name: 'Statistics transactions',
    component: TransactionStatistics,
    meta: {
      titleKey: 'statistic.txs',
      breadcrumbs: [
        {
          name: 'Statistics',
          link: '/statistics'
        },
        { name: 'Transactions' }
      ]
    }
  },
  {
    path: 'market-cap',
    name: 'Statistics Market Cap',
    component: MarketCapStatistics,
    meta: {
      titleKey: 'statistic.market_cap',
      breadcrumbs: [
        {
          name: 'Statistics',
          link: '/statistics'
        },
        { name: 'Market Cap' }
      ]
    }
  },
  {
    path: 'transaction-value',
    name: 'Statistics Transaction Value',
    component: TransactionValueStatistic,
    meta: {
      titleKey: 'statistic.transaction_value',
      breadcrumbs: [
        {
          name: 'Statistics',
          link: '/statistics'
        },
        { name: 'Transaction Value' }
      ]
    }
  },
  {
    path: 'blocks',
    name: 'Statistics blocks',
    component: BlocksStatistic,
    meta: {
      titleKey: 'statistic.blocks',
      breadcrumbs: [
        {
          name: 'Statistics',
          link: '/statistics'
        },
        { name: 'Blocks' }
      ]
    }
  },
  {
    path: 'difficulty',
    name: 'Statistics difficulty',
    component: DifficultyStatistic,
    meta: {
      titleKey: 'statistic.difficulty',
      breadcrumbs: [
        {
          name: 'Statistics',
          link: '/statistics'
        },
        { name: 'Difficulty' }
      ]
    }
  },
  {
    path: 'hashrate',
    name: 'Statistics hashrate',
    component: HashrateStatistic,
    meta: {
      titleKey: 'statistic.hashrate',
      breadcrumbs: [
        {
          name: 'Statistics',
          link: '/statistics'
        },
        { name: 'Hashrate' }
      ]
    }
  },
  {
    path: 'mining-profitability',
    name: 'Statistics mining profitability',
    component: MiningProfitabilityStatistic,
    meta: {
      titleKey: 'statistic.mining_profitability',
      breadcrumbs: [
        {
          name: 'Statistics',
          link: '/statistics'
        },
        { name: 'Mining profitability' }
      ]
    }
  },
  {
    path: '*',
    redirect: 'market-cap'
  }
]
