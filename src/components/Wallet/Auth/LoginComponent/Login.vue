<template>
  <div class="flex justify-end full-height">
    <div class="wrapper_login column justify-center content-center q-mt-xl">
      <div class="fs-16 text-bold text-center q-mb-lg">{{$t('login.login')}}</div>
      <q-card>
        <component :is="currentStep"
                   :key="currentStep"
                   @validateMnemonic="validateMnemonic"
                   @loginPassword="loginPassword"
                   @clearErr="error = ''"
                   @update:error="setError"
                   :token="token"
                   :error.sync="error"
        >
        </component>
      </q-card>
    </div>
  </div>
</template>

<script>
import CheckMnemonic from './login/CheckMnemonic'
import LoginPassword from './login/LoginPassword'
import TwoFactorAuth from './login/TwoFactorAuth'
import Mnemonic from 'bitcore-mnemonic'
import bitcore from 'bitcore-lib'
import apiUrls from '../../../../services/api-urls'
import SimpleCrypto from 'simple-crypto-js'

export default {
  name: 'Login',
  components: {
    CheckMnemonic,
    LoginPassword,
    TwoFactorAuth
  },
  data () {
    return {
      seedPhrase: '',
      seedToCrypto: [],
      currentStep: 'CheckMnemonic',
      loginBody: {},
      error: '',
      seed: '',
      token: '',
      emailConfirmed: Boolean
    }
  },
  methods: {
    setError (err) {
      this.error = err
    },
    async validateMnemonic (phrase) {
      let seedPhrase = phrase.replace(/\r?\n/g, ' ')
      try {
        this.seedToCrypto = seedPhrase
        this.seedPhrase = new Mnemonic(seedPhrase)
      } catch (e) {
        this.error = this.$t('validation_errors.invalid_mnemonic')
        return
      }
      const bip39 = require('bip39')
      const seed = bip39.mnemonicToSeedSync(seedPhrase).toString('hex')
      this.seed = seed
      try {
        this.loading = true
        const MESSAGE_TO_SIGN = 'login'
        let hdKey = bitcore.HDPrivateKey.fromSeed(this.seed)
        let msg = new bitcore.Message(MESSAGE_TO_SIGN)
        let signature = msg.sign(hdKey.privateKey)
        let masterAddress = hdKey.publicKey.toAddress().toString()
        this.loginBody.pubHash = masterAddress
        this.loginBody.signature = signature
      } catch (e) {
        this.error = this.$t('validation_errors.unexpected_error')
      }
      try {
        let profileInfo = await this.axios.post(apiUrls.login, this.loginBody)
        if (profileInfo.data.token) {
          this.token = profileInfo.data.token
          this.currentStep = 'LoginPassword'
        } else {
          this.error = this.$t('validation_errors.user_not_found')
        }
      } catch (e) {
        this.error = this.$t('validation_errors.user_not_found')
      }
    },
    getProfile () {
      return this.axios.get(apiUrls.profile, {
        headers: { 'X-Auth-Token': this.token }
      })
    },

    async loginPassword (password) {
      let simpleCrypto = new SimpleCrypto(password)
      let dataToEncrypt = {
        phrase: this.seedToCrypto,
        seed: this.seed
      }
      let encryptText = simpleCrypto.encrypt(dataToEncrypt)
      localStorage.setItem('cryptoData', encryptText)
      try {
        await this.getProfile()
          .then(data => {
            this.enabled2fa = data.data.enabled2fa
            this.emailConfirmed = data.data.emailConfirmed
          })
        if (this.enabled2fa) {
          this.currentStep = 'TwoFactorAuth'
        } else {
          localStorage.setItem('sessionToken', this.token)
          this.$store.commit('User/setProfile', true)
          if (!this.emailConfirmed) {
            this.$router.push({ name: 'SettingsUser' })
          } else {
            this.$router.push({ name: 'UserWallet' })
          }
          this.$root.$emit('checkLang')
        }
      } catch (e) {
        console.log(e)
      }
    }
  }

}
</script>

<style scoped>

</style>
