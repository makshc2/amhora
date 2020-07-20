<template>
  <div class="full-width">
    <div class="title fs-18 q-mb-lg">{{$t('settings.security')}}</div>
    <div class="row q-gutter-x-lg">
      <div class="col-5">
        <div class="fs-15 q-mb-sm">{{$t('settings.authenticator')}}</div>
        <q-select outlined
                  v-model="enable2FactorAuth"
                  :options="option2FA"
                  color="black"
                  @input="openPopUp2fa"
        />
        <div class="info fs-14 text-grey-5 q-mt-lg">
          {{$t('settings.authenticator_info')}}
        </div>
      </div>
      <div class="col-5">
        <div class="fs-15 q-mb-sm">{{$t('settings.auto_logout')}}</div>
        <q-select outlined
                  v-model="autoLogout"
                  :options="autoLogoutOptions"
                  color="black"
                  @input="saveAutoLogout"
        />
        <div class="info fs-14 text-grey-5 q-mt-lg">
          {{$t('settings.auto_logout_info')}}
        </div>
      </div>
      <div class="row q-mt-lg">
        <q-btn :label="'Change password'"
               class="q-mr-md text-capitalize"

        />
        <q-btn :label="'Delete account'"
               color="red"
               class="text-capitalize"
               @click="deleteAccount"
        />
      </div>
    </div>
  </div>
</template>

<script>
import apiUrls from '@/services/api-urls'
import bitcore from 'bitcore-lib'
import { exportFile } from 'quasar'

export default {
  name: 'Security',
  data () {
    return {
      enable2FactorAuth: {
        label: '',
        value: ''
      },
      option2FA: [
        {
          label: this.$t('global.no'),
          value: false
        },
        {
          label: this.$t('global.yes'),
          value: true
        }
      ],
      autoLogout: {
        label: this.$t('global.time.one_day'),
        value: 86400
      },
      autoLogoutOptions: [
        {
          label: this.$t('global.time.one_hour'),
          value: 3600
        },
        {
          label: this.$t('global.time.six_hour'),
          value: 21600
        },
        {
          label: this.$t('global.time.one_day'),
          value: 86400
        },
        {
          label: this.$t('global.time.three_day'),
          value: 259200
        },
        {
          label: this.$t('global.time.one_week'),
          value: 604800
        }
      ]
    }
  },
  methods: {
    openPopUp2fa () {
      this.$store.commit('ModalDialogService/openModalDialog', {
        dialogName: 'On2FactorAuth',
        payload: {
          showQR: this.enable2FactorAuth.value
        }
      })
    },
    saveAutoLogout () {
      this.axios.post(apiUrls.set_session, {
        sessionDuration: this.autoLogout.value
      })
        .then(() => {
          this.$q.notify({
            position: 'top',
            message: this.$t('global.saved_email'),
            color: 'green',
            textColor: 'white'
          })
        })
    },
    getProfile () {
      this.axios.get(apiUrls.profile)
        .then(data => {
          if (!data.data.enabled2fa) {
            this.enable2FactorAuth = this.option2FA[0]
          } else {
            this.enable2FactorAuth = this.option2FA[1]
          }
          let session = data.data.sessionDuration
          this.autoLogoutOptions.map((element, index) => {
            if (element.value === session) {
              this.autoLogout = this.autoLogoutOptions[index]
            }
          })
        }).catch()
    },
    deleteAccount () {
      this.$store.commit('ModalDialogService/openModalDialog', {
        dialogName: 'ConfirmPassword',
        payload: {
          getSeedPhrase: false
        }
      })
      this.downloadAccount()
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
    }
  },
  created () {
    this.$root.$on('closeDialog', () => {
      if (localStorage.sessionToken) {
        this.getProfile()
      }
    })
    this.getProfile()
    this.getSeed()
  }
}
</script>

<style scoped>

</style>
