<template>
    <div class="middle-part">
        <WalletPageHeader class="full-width"/>
        <div class="q-mt-xl">
            <div class="d-flex q-ml-md">
                <span>{{$t('global.range')}}</span>
                <SmallSelect
                        :items="rangeVariables"
                        :value="range"
                        @onSelect="changeRange"
                />
            </div>
            <q-slide-transition appear :duration="1000">
            <div class="wrapper_chart">
                <WalletChart :range="this.range"
                             @get-data="val => chartData = val"
                />
            </div>
            </q-slide-transition>
        </div>
        <transition appear
                    enter-active-class="animated fadeIn"
                    leave-active-class="animated fadeOut">
            <AllCryptoWallet />
        </transition>
        <q-slide-transition appear :duration="1000">
            <RecentActivites />
        </q-slide-transition>
    </div>
</template>

<script>
import SmallSelect from '../../commonUI/SmallSelect'
import WalletPageHeader from './WalletPage/WalletPageHeader'
import WalletChart from './WalletPage/WalletChart'
import AllCryptoWallet from './WalletPage/AllCryptoWallet'
import RecentActivites from './WalletPage/RecentActivities'

export default {
  name: 'UserWallet',
  components: {
    WalletPageHeader,
    WalletChart,
    SmallSelect,
    AllCryptoWallet,
    RecentActivites
  },
  data () {
    return {
      range: 'market_short_info.day',
      rangeVariables: ['market_short_info.day', 'market_short_info.hour', 'market_short_info.week'],
      chartData: {
        rateHistory: []
      }
    }
  },
  methods: {
    changeRange (val) {
      this.range = val
    }
  }
}
</script>

<style scoped>

</style>
