<template>
    <div class="wrapper_header full-width row justify-between">
        <div class="wrapper_balance row q-gutter-x-xl">
            <div class="column fs-18">
                <span>{{$t('wallet.total_balance')}}</span>
                <div class="row justify-start items-center q-gutter-x-sm">
                    <span>{{fiatIcon}}{{totalBalance}}</span>
                    <q-icon name="fas fa-retweet"
                            class="cursor-pointer"
                            color="blue-grey-3"
                            @click="refresh"
                    />
                </div>
            </div>
            <div class="column fs-18">
                <div class="row justify-start items-center">
                    <span>{{$t('wallet.unconfirmed')}}</span>
                    <span class="ask ask_tooltip"
                          v-tooltip.bottom="{content: $t('wallet.tooltip_unconfirmed')}">!</span>
                </div>
                <span class="fs-16">{{fiatIcon}}{{unconfirmed_balance}}</span>
            </div>
        </div>
        <div class="button_wrapper q-gutter-x-lg">
            <q-btn color="blue-grey-1"
                   icon="fas fa-cog"
                   label="Settings"
                   class="fs-14 text-black text-capitalize"
                   @click="$router.push({name:'SettingsUser'})"
            />
            <q-btn color="deep-orange-5"
                   label="Log out"
                   class="fs-14 text-capitalize"
                   @click="logOut"
            />
        </div>
    </div>
</template>

<script>
import fiatSignMixin from '../../../../mixins/fiatSignMixin'
import { mapGetters } from 'vuex'

export default {
  name: 'WalletPageHeader',
  data () {
    return {
      totalBalance: '6260.26',
      unconfirmed_balance: '6260.26'
    }
  },
  mixins: [fiatSignMixin],
  computed: {
    ...mapGetters({
      rate: 'rate',
      fiat: 'fiat',
      currencyButtons: 'currencyButtons',
      crypto: 'crypto'
    })
  },
  methods: {
    refresh () {
      console.log('refresh')
    },
    logOut () {
      localStorage.removeItem('sessionToken')
      localStorage.removeItem('cryptoData')
      localStorage.removeItem('checkFiat')
      this.$router.push({ name: 'WelcomePage' })
      this.$root.$emit('checkLang')
    }
  }
}
</script>

<style scoped>

</style>
