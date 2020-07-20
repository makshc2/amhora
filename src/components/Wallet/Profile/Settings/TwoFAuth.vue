<template>
    <q-card style="width: 420px">
        <q-card-section>
            <div class="text-h5 q-mt-sm q-mb-xs">Enable 2FA for your security</div>
            <div class="text-overline">Two-factor authentication</div>
            <div class="bg-grey-2 q-pa-sm rounded-borders">
                <q-toggle @input="check2fa"
                          name="activate2FA"
                          v-model="activate2FA"
                          :label="!activate2FA ? $t('login.activate') : $t('login.deactivate')"
                />
            </div>
        </q-card-section>
        <q-slide-transition appear>
            <EnabledTwoFA @update_info="getProfile"
                          ref="check2Fa"
                          :isActive="isActive"
                          :activate2FA="activate2FA">

            </EnabledTwoFA>
        </q-slide-transition>
        <q-card-section>
            <q-btn @click="deleteAccount">Test delete account</q-btn>
        </q-card-section>
        <q-card-section>
            <q-btn @click="downloadAccount">Test download account</q-btn>
        </q-card-section>
    </q-card>
</template>

<script>
import apiUrls from '@/services/api-urls'
import EnabledTwoFA from '../../Auth/LoginComponent/login/EnabledTwoFA'
import { exportFile } from 'quasar'
import bitcore from 'bitcore-lib'

export default {
  name: 'TwoFAuth',
  components: { EnabledTwoFA },
  data () {
    return {
      activate2FA: '',
      isActive: '',
      cryptoData: {},
      pubHash: '',
      signature: '',
      dataAccount: {}
    }
  },
  methods: {
    deleteAccount () {
      this.$store.commit('ModalDialogService/openModalDialog', {
        dialogName: 'ConfirmPassword'
      })
    },
    getSeed () {
      this.$root.$on('confirmPassword', (data) => {
        this.cryptoData = data
        const MESSAGE_TO_SIGN = 'delete'
        let hdKey = bitcore.HDPrivateKey.fromSeed(this.cryptoData.seed)
        let msg = new bitcore.Message(MESSAGE_TO_SIGN)
        let signature = msg.sign(hdKey.privateKey)
        let masterAddress = hdKey.publicKey.toAddress().toString()
        this.axios.delete(apiUrls.account, {
          data: {
            pubHash: masterAddress,
            signature: signature
          }
        })
          .then(() => {
            localStorage.removeItem('sessionToken')
            localStorage.removeItem('cryptoData')
            this.$router.push({ name: 'WelcomePage' })
          })
      })
    },
    downloadAccount () {
      this.axios.get(apiUrls.account)
        .then((data) => {
          this.dataAccount = data.data.data
          exportFile('Account.amh', this.dataAccount)
        })
    },
    check2fa () {
      if (this.activate2FA) {
        this.$refs.check2Fa.get2FAcode()
      }
    },
    getProfile () {
      this.axios.get(apiUrls.profile)
        .then(data => {
          this.activate2FA = data.data.enabled2fa
          this.isActive = data.data.enabled2fa
        })
    }
  },
  created () {
    this.getProfile()
    this.getSeed()
  }
}
</script>

<style scoped>

</style>
