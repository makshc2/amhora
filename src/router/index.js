import Vue from 'vue'
import Router from 'vue-router'
import store from '../store'
import statisticsChildrenRoures from './statisticsChildrenRoures'
import currencies from '../constants/coinsArray'
import Market from '../components/Market/Market'

import walletChildrenRouters from './walletChildrenRouters'

const Explorer = () => import(/* webpackChunkName: "explorer" */'../components/Explorer/Explorer')
const DefaultExplorer = () => import(/* webpackChunkName: "explorer" */'../components/Explorer/DefaultExplorer')
const Address = () => import('../components/Explorer/address/Address')
const BlockDetails = () => import('../components/Explorer/blockDetails/BlockDetails')
const BlockExplorer = () => import('../components/Explorer/blockExplorer/BlockExplorer')
const MemoryPool = () => import('../components/Explorer/memoryPool/MemoryPool')
const FourZeroFour = () => import('../components/FourZeroFour.vue')
const TransactionDetails = () => import('../components/Explorer/transaction/TransactionDetails')
const Wallet = () => import('../components/Wallet/Wallet')
const Statistics = () => import('../components/Statistics/Statistics')
const Error = () => import('../components/Error')

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/wallet',
      name: 'Wallet',
      component: Wallet,
      redirect: '/wallet/welcome-page',
      children: [...walletChildrenRouters]
    },
    {
      path: '/statistics',
      name: 'Statistics',
      component: Statistics,
      children: [...statisticsChildrenRoures],
      redirect: '/statistics/transactions'
    },
    {
      path: '/market/:currency/',
      name: 'Market',
      component: Market,
      meta: {
        breadcrumbs: [
          { name: 'market' }
        ]
      },
      beforeEnter (to, from, next) {
        const crypto = to.params.currency
        store.commit('DISABLE_CRYPTO_FIAT_PAIRS', true)
        if (crypto && currencies.includes(crypto.toUpperCase())) {
          next()
          return
        }
        next('/market/btc/')
      }
    },
    {
      path: '/error',
      name: 'Error',
      beforeEnter (to, from, next) {
        if (from.meta.breadcrumbs) {
          let newBreadcrumbs = [...from.meta.breadcrumbs]
          for (let crumb of newBreadcrumbs) {
            if (crumb.param) {
              crumb.paramVal = from.params[crumb.param] || ''
            }
          }
          to.meta.breadcrumbs = newBreadcrumbs
        }
        next()
      },
      component: Error
    },
    {
      path: '/',
      component: Explorer,
      children: [
        {
          path: '',
          name: 'Default',
          component: DefaultExplorer,
          meta: {
            breadcrumbs: [
              { isCrypto: true },
              { name: 'explorer' }
            ]
          }
        }
      ]
    },
    {
      path: '/:currency/',
      name: 'Explorer',
      component: Explorer,
      props: true,
      beforeEnter: checkCrypto,
      redirect: { name: 'DefaultExplorer' },
      children: [
        {
          path: '',
          name: 'DefaultExplorer',
          component: DefaultExplorer,
          meta: {
            breadcrumbs: [
              { isCrypto: true },
              { name: 'explorer' }
            ]
          }
        },
        {
          path: 'address/:address',
          name: 'Address',
          component: Address,
          meta: {
            breadcrumbs: [
              { isCrypto: true },
              { name: 'address' },
              { param: 'address' }
            ]
          },
          props: true
        },
        {
          path: 'block/:block',
          name: 'Block',
          component: BlockDetails,
          meta: {
            breadcrumbs: [
              { isCrypto: true },
              { name: 'block' },
              { param: 'block' }
            ]
          },
          props: true
        },
        {
          path: 'transaction/:hash',
          name: 'TransactionDetails',
          component: TransactionDetails,
          meta: {
            breadcrumbs: [
              { isCrypto: true },
              { name: 'transaction' },
              { param: 'hash' }
            ]
          },
          props: true
        },
        {
          path: 'blocks',
          name: 'Block Explorer',
          component: BlockExplorer,
          meta: {
            breadcrumbs: [
              { isCrypto: true },
              { name: 'block_explorer' }
            ]
          }
        },
        {
          path: 'mempool',
          name: 'Memory Pool',
          component: MemoryPool,
          meta: {
            breadcrumbs: [
              { isCrypto: true },
              { name: 'memory_pool' }
            ]
          }
        },
        {
          path: 'mempool/:hash',
          name: 'MemoryPoolDetails',
          component: TransactionDetails,
          meta: {
            breadcrumbs: [
              { isCrypto: true },
              { name: 'transaction' },
              { param: 'hash' }
            ]
          },
          props: true
        }
      ]
    },
    {
      path: '/404',
      name: 'not-found',
      alias: '*',
      component: FourZeroFour
    },
    {
      path: '*',
      component: FourZeroFour
    }

  ]
})

function checkCrypto (to, from, next) {
  const crypto = to.params.currency
  crypto && currencies.includes(crypto.toUpperCase()) ? next() : next('/btc')
}
