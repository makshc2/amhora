<template>
    <div class="full-width">
        <div class="title fs-18 q-mb-lg">{{$t('settings.wallet_settings')}}</div>
        <div class="wrapper row">
            <div class="col-6">
                <div class="row items-center">
                    <div>
                        <div class="fs-15 q-mb-sm">{{$t('settings.login_id')}}</div>
                        <q-input v-model="login"
                                 outlined
                                 disable
                                 class="q-mb-lg"
                                 :label="$t('global.login')"
                                 no-error-icon
                                 color="black"
                        />
                    </div>
                    <div class="relative-position copy-button">
                        <BaseCopyButton :content="login"></BaseCopyButton>
                    </div>
                </div>
                <div class="info fs-14 text-grey-5">
                    {{$t('settings.login_id_info')}}
                </div>
            </div>
            <div class="col-4">
                <div class="fs-15 q-mb-sm">
                    {{$t('settings.download_wallet')}}
                </div>
                <div>
                    <q-select @input="getWallet"
                            outlined
                            v-model="wallet"
                            :options="walletOption"
                            :label="$t('settings.select_wallet')"
                            class="q-mb-lg"
                            color="black"
                    />
                </div>
                <q-btn
                      :filled="cryptoWallet.length"
                      :outline="!cryptoWallet.length"
                      class="fs-14 q-mt-sm cursor-pointer text-capitalize"
                      @click="downloadWallet"
                      :label="$t('global.download')"
                      :disable="!cryptoWallet.length"
                      :color="!cryptoWallet.length? 'text-grey-8':'green'"
                />
            </div>
        </div>
    </div>
</template>

<script>
import BaseCopyButton from '../../../commonUI/BaseCopyButton'
import apiUrls from '@/services/api-urls'
import { exportFile } from 'quasar'

export default {
  name: 'WalletSettings',
  components: {
    BaseCopyButton
  },
  props: {
    login: {
      type: Array
    }
  },
  data () {
    return {
      wallet: '',
      walletOption: [],
      cryptoWallet: [],
      selectCryptoWallet: [],
      seed: []
    }
  },
  methods: {
    getAllWallet () {
      this.axios.get(apiUrls.wallet)
        .then((data) => {
          data.data.forEach(element => {
            this.walletOption.push({
              label: element.currency.toUpperCase(),
              value: element.id
            })
          })
        })
    },
    getWallet () {
      this.seed = []
      this.cryptoWallet = []
      this.axios.get(apiUrls.address + `/${this.wallet.value}`)
        .then((data) => {
          this.selectCryptoWallet = data.data
          this.$store.commit('ModalDialogService/openModalDialog', {
            dialogName: 'ConfirmPassword',
            payload: {
              getSeedPhrase: true
            }
          })
        }).catch(e => { console.log(e) })
    },
    downloadWallet () {
      exportFile(`${this.login} ${this.wallet.label}-wallet.json`,
        JSON.stringify(this.cryptoWallet))
    },
    getSeed () {
      this.$root.$on('getSeed', (data) => {
        this.seed = data.seed
        this.selectCryptoWallet.forEach(element => {
          const { generatePrivateKey } = require(`@/plugin/cryptoWalletGenerate/${this.wallet.label.toLowerCase()}`)
          let getPrivateKey = generatePrivateKey(this.seed, element.derivationNum)
          this.cryptoWallet.push({
            address: element.address,
            derivation: element.derivation,
            private_key: getPrivateKey
          })
        })
      })
    }
  },
  created () {
    this.getAllWallet()
    this.getSeed()
  }
}
</script>

<style scoped>
    .copy-button {
        left: -40px;
        top: 5px;
    }
</style>
