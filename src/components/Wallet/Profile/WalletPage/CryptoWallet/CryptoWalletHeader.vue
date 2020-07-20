<template>
    <div class="wrapper_balance row justify-between q-mt-lg q-mr-xl avenir-font-family">
      <div class="row q-gutter-x-lg">
        <div class="column fs-18 q-gutter-y-md">
          <span class="text-grey-5 fs-15">{{$t('wallet.total_balance')}}</span>
          <div>
            <div class="row justify-start items-center q-gutter-x-sm q-mb-md">
              <span>{{totalBalance}} {{crypto.toUpperCase()}}</span>
              <q-icon name="fas fa-retweet"
                      class="cursor-pointer"
                      color="blue-grey-3"
                      @click="refresh"
              />
            </div>
            <span>{{fiatIcon}}{{totalBalance}}</span>
          </div>
        </div>
        <div class="column fs-18 q-gutter-y-md">
          <div class="row justify-start items-center">
            <span class="text-grey-5 fs-15">{{$t('wallet.unconfirmed')}}</span>
            <span class="ask ask_tooltip" v-tooltip.bottom="{content: $t('wallet.tooltip_unconfirmed')}">!</span>
          </div>
          <div class="column">
            <span class="q-mb-md">{{totalBalance}} {{crypto.toUpperCase()}}</span>
            <span>{{fiatIcon}}{{totalBalance}}</span>
          </div>
        </div>
      </div>
        <div class="row">
            <qrcode-vue :value="allAddress[0].address"
                        :size="100"
                        background="#fff"
                        level="H"
            />
            <div class="column justify-between">
                <div class="row">
                    <span class="q-ml-md fs-15">{{allAddress[0].address}}</span>
                    <BaseCopyButton class="text-grey-5" :content="[allAddress[0].address]"/>
                </div>
                <div class="q-ml-md q-mb-sm">
                    <q-btn size="10px"
                           flat
                           icon="fas fa-sync"
                           class="bg-grey-3 text-capitalize q-mr-md"
                           :label="$t('wallet.generate_new')"/>
                    <q-btn size="10px"
                           flat
                           icon="fas fa-bars"
                           class="bg-grey-3 text-capitalize"
                           :label="$t('wallet.history')"/>
                </div>
            </div>
        </div>
        <q-separator class="q-my-lg"></q-separator>
    </div>
</template>

<script>
import apiUrls from '@/services/api-urls'
import fiatSignMixin from '@/mixins/fiatSignMixin'
import { mapGetters } from 'vuex'
import QrcodeVue from 'qrcode.vue'
import BaseCopyButton from '../../../../commonUI/BaseCopyButton'

export default {
  name: 'CryptoWalletHeader',
  components: {
    QrcodeVue,
    BaseCopyButton
  },
  data () {
    return {
      receiveInfo: null,
      totalBalance: '6260.26',
      unconfirmed_balance: '6260.26',
      address: '',
      allAddress: [{}]
    }
  },
  props: {
    walletId: {
      type: Number
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
    getAllAddress () {
      this.axios.get(apiUrls.address + `/${this.walletId}`)
        .then((data) => {
          this.allAddress = data.data
          console.log(this.allAddress)
        })
    },
    refresh () {
      console.log('refresh')
    }
  },
  created () {
    this.getAllAddress()
  }
}
</script>

<style scoped>

</style>
