<template>
      <q-card-section>
        <q-tab-panels v-model="activeTab" animated>
          <q-tab-panel class="q-pt-none" name="password">
            <div class="fs-18 text-center q-mb-lg">
              {{$t('settings.timed_out')}}
            </div>
            <div v-if="checkMode">
              <div class="fs-15 q-mb-sm">{{$t('settings.enter_session_password')}}</div>
                <q-input
                  filled
                  type="password"
                  autocomplete="new-password"
                  dense outlined field no-error-icon
                  color="black"
                  v-model="password"
                  :label="$t('global.password')"
                  class="q-pb-lg"
                />
              <div class="flex justify-center q-gutter-x-lg">
                <q-btn @click="loginPassword"
                       color="grey-9"
                       class="q-mt-lg text-capitalize"
                       :label="$t('registration.enter_my_account')"
                       :disable="!password"
                />
                <q-btn @click="logOut"
                       color="red"
                       class="q-mt-lg text-capitalize"
                       :label="$t('wallet.log_out')"
                />
              </div>
            </div>
            <div v-else>
              <div class="flex justify-center q-gutter-x-lg">
                <q-btn @click="readOnly"
                       color="black"
                       class="q-mt-lg text-capitalize"
                       :label="$t('registration.enter_my_account')"
                />
                <q-btn @click="logOut"
                       color="red"
                       class="q-mt-lg text-capitalize"
                       :label="$t('wallet.log_out')"
                />
              </div>
            </div>
          </q-tab-panel>
          <q-tab-panel class="q-pt-none q-ma-none" name="twoFactor">
            <TwoFactorAuth :token="token"/>
          </q-tab-panel>
        </q-tab-panels>
      </q-card-section>
</template>

<script>
import TwoFactorAuth from '../Wallet/Auth/LoginComponent/login/TwoFactorAuth'
import apiUrls from '@/services/api-urls'
import bitcore from 'bitcore-lib'
import SimpleCrypto from 'simple-crypto-js'
export default {
  name: 'SessionPassword',
  components: {
    TwoFactorAuth
  },
  data () {
    return {
      activeTab: 'password',
      login: '',
      check2Fa: Boolean,
      password: '',
      cryptoData: {},
      token: '',
      loginBody: {}
    }
  },
  computed: {
    checkMode () {
      return !!localStorage.cryptoData
    }
  },
  methods: {
    async loginPassword () {
      try {
        this.cryptoData = localStorage.getItem('cryptoData')
        let simpleCrypto = new SimpleCrypto(this.password)
        let cryptoData = simpleCrypto.decrypt(this.cryptoData)
        const MESSAGE_TO_SIGN = 'login'
        let hdKey = bitcore.HDPrivateKey.fromSeed(cryptoData.seed)
        let msg = new bitcore.Message(MESSAGE_TO_SIGN)
        let signature = msg.sign(hdKey.privateKey)
        let masterAddress = hdKey.publicKey.toAddress().toString()
        this.loginBody.pubHash = masterAddress
        this.loginBody.signature = signature
        let profileInfo = await this.axios.post(apiUrls.login, this.loginBody)
        this.token = profileInfo.data.token
        localStorage.setItem('sessionToken', this.token)
        this.axios.get(apiUrls.profile, {
          headers: { 'X-Auth-Token': this.token }
        })
          .then(data => {
            this.login = data.data.id
            this.check2Fa = data.data.enabled2fa
            if (this.check2Fa) {
              this.activeTab = 'twoFactor'
            } else {
              localStorage.setItem('sessionToken', this.token)
              this.$store.commit('ModalDialogService/closeDialog')
            }
          })
          .catch(e => console.log(e))
      } catch (e) {
        this.error = this.$t('validation_errors.unexpected_error')
      }
    },
    readOnly () {
      this.axios.post(apiUrls.login, {
        id: this.login
      })
        .then((data) => {
          this.token = data.data.token
          if (this.check2Fa) {
            this.activeTab = 'twoFactor'
          } else {
            localStorage.setItem('sessionToken', this.token)
            this.$store.commit('ModalDialogService/closeDialog')
          }
        })
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

<style lang="scss">

</style>
