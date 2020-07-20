<template>
    <div class="full-width q-mt-lg">
        <div class="q-mb-lg fs-18">
            {{$t('wallet.your_balances')}}
        </div>
        <div class="wrapper_crypto_wallet flex justify-between">
            <q-card class="custom-border-radius-5 progress-wrapper q-mb-lg cursor-pointer" style="width: 280px"
                    flat
                    bordered
                    v-for="(cryptoWallet, index) in wallets"
                    :key="index"
                    :class="{'progress-bar':true}"
            >
                <router-link class="no-link" :to="{path: `user-wallet/${cryptoWallet.currency}`, query: {id: cryptoWallet.id}}">
                    <div class="progress-bar-item">
                        <q-card-section class="row">
                            <CollorCurrencySvgs
                                    class="crypto_icon"
                                    :currency="parseCryptoIcon(cryptoWallet)"
                            />
                            <span class="q-ml-md">
                        {{$options.CRYPTO_NAMES[cryptoWallet.currency.toUpperCase()]}}
                    </span>
                        </q-card-section>
                        <q-card-section class="q-ml-xl">
                            <div>
                                {{fiatIcon}}{{cryptoWallet.balanceFiat || 0}}
                            </div>
                            <div class="text-grey-5">
                                <span class="q-mr-sm">{{cryptoWallet.balanceCrypto || 0}}</span>
                                <span>{{cryptoWallet.currency.toUpperCase()}}</span>
                            </div>
                        </q-card-section>
                        <q-card-section class="q-ml-xl">
                            <q-icon class="q-mr-md cursor-pointer"
                                    name="fas fa-qrcode"/>
                            <q-icon name="far fa-copy"/>
                        </q-card-section>
                    </div>
                </router-link>
            </q-card>
        </div>
    </div>
</template>

<script>
import CollorCurrencySvgs from '../../../commonUI/CollorCurrencySvgs'
import CRYPTO_NAMES from '../../../../constants/cryptoName'
import fiatSignMixin from '../../../../mixins/fiatSignMixin'
import { mapGetters } from 'vuex'
import apiUrls from '@/services/api-urls'

export default {
  CRYPTO_NAMES,
  name: 'AllCryptoWallet',
  components: {
    CollorCurrencySvgs
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
  data () {
    return {
      wallets: []
    }
  },
  methods: {
    parseCryptoIcon (cryptoWallet) {
      // eslint-disable-next-line no-return-assign
      return cryptoWallet.currency === 'dash' ? cryptoWallet.currency = 'dsh' : cryptoWallet.currency.toUpperCase()
    },
    getWallets () {
      this.axios.get(apiUrls.wallet)
        .then((data) => {
          this.wallets = data.data
        }).catch(e => { console.log(e) })
    }
  },
  created () {
    this.getWallets()
  }

}
</script>

<style lang="scss">
    .progress-bar-item {
        z-index: 9999;
    }

    .progress-wrapper {
        width: 100%;
        height: 100%;

        &.progress-bar {
            &::before {
                position: absolute;
                content: '';
                height: 100%;
                width: 40%;
                background: #efefef;
                z-index: 0;
            }
        }
    }

    .crypto_icon {
        svg {
            width: 30px !important;
            height: 30px !important;
        }
    }
</style>
