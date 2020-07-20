<template>
    <div class="column no-wrap">
      <breadcrumbs :routeName='$route.name' :currency="currency" class="no-margin" style="max-width: 100%"></breadcrumbs>
        <transition appear
                    enter-active-class="animated fadeIn"
                    leave-active-class="animated fadeOut">
            <CryptoWalletHeader :walletId="walletId" />
        </transition>
        <transition appear
                    enter-active-class="animated fadeIn"
                    leave-active-class="animated fadeOut">
            <Addresses :currency="currency"
                       :walletId="walletId"
            />
        </transition>
        <transition appear
                    enter-active-class="animated fadeIn"
                    leave-active-class="animated fadeOut">
            <RecentActivities />
        </transition>
<!--        <div>{{currency.toUpperCase()}} wallet test page</div>-->
<!--        <div v-for="(address, index) in allAddress"-->
<!--            :key="index"-->
<!--        >-->
<!--            All address:{{address || 'No addresses'}}</div>-->
<!--        <div class="q-mt-md">-->
<!--            <q-btn @click="openDialogConfirmPassword">Test generate</q-btn>-->
<!--        </div>-->
    </div>
</template>

<script>
import apiUrls from '@/services/api-urls'
import Breadcrumbs from '../../../../commonUI/Breadcrumbs'
import CryptoWalletHeader from './CryptoWalletHeader'
import Addresses from './Addresses'
import RecentActivities from './RecentActivities'

export default {
  name: 'CryptoWallet',
  components: {
    Breadcrumbs,
    CryptoWalletHeader,
    Addresses,
    RecentActivities
  },
  data () {
    return {
      cryptoData: {},
      walletId: '',
      currency: ''
    }
  },

  methods: {
    parseRouter () {
      this.walletId = +this.$route.query.id
      this.currency = this.$route.params.currency
    },
    openDialogConfirmPassword () {
      this.$store.commit('ModalDialogService/openModalDialog', {
        dialogName: 'ConfirmPassword',
        payload: {
          getSeedPhrase: true
        }
      })
    },
    getSeed () {
      this.$root.$on('confirmPassword', (data) => {
        this.cryptoData = data
        console.log(this.cryptoData)
      })
      const { generateWallet } = require('@/plugin/cryptoWalletGenerate/' + `${this.currency}`)
    },
    getLastAddress () {
      this.axios.get(apiUrls.address + `/${this.walletId}`)
    }
  },
  created () {
    this.parseRouter()
  }
}
</script>

<style scoped>

</style>
