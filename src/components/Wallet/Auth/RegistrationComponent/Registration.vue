<template>
    <div class="flex justify-end full-height">
      <div class="cursor-pointer link-underline"
      >
        <div @click="$router.push({name:'WelcomePage'})">
          {{$t('registration.i_have_wallet')}}
        </div>
        <div class="q-mt-sm cursor-pointer wrap"
             @click="$router.push({name: 'RecoverAccess'})"
             style="width: 250px"
        >
          {{$t('registration.forgot_seed')}}
        </div>
      </div>
        <div class="wrapper_login column justify-center content-center q-mt-xl">
          <div class="text-center fs-18 q-pb-lg">{{$t('registration.registration')}}</div>
            <!--animation-->
            <component :is="registrationStep"
                       :seedPhrase="seedPhrase"
                       :seedToCheck="seedToCheck"
                       :login="login"
                       :loading="loading"
                       @back="registrationStep = 'GenerateSeed'"
                       @addSeed="generateSeed"
                       @checkSeed="checkSeed"
                       @downloadKeyCard="createKeyCard"
                       @sessionPassword="getSessionPassword"
            />
        </div>
    </div>
</template>

<script>
import bitcore from 'bitcore-lib'
import GenerateSeed from './GenerateSeed'
import CheckSeed from './CheckSeed'
import KeyCardPassword from './KeyCardPassword'
import PasswordCurrentSession from './PasswordCurrentSession'
import SimpleCrypto from 'simple-crypto-js'
import { exportFile } from 'quasar'
import apiUrls from '@/services/api-urls'

export default {
  name: 'Registration',
  components: {
    GenerateSeed,
    CheckSeed,
    KeyCardPassword,
    PasswordCurrentSession
  },
  data () {
    return {
      registrationStep: 'GenerateSeed',
      registrationData: {},
      loginBody: {},
      seedPhrase: [],
      seedToCheck: [],
      sessionPass: '',
      sessionLogin: '',
      login: '',
      seed: '',
      seedSession: '',
      loading: false,
      token: ''
    }
  },
  methods: {
    generateSeed (data) {
      this.seedPhrase = data.seed
      this.seedToCheck = data.seedToCheck
      this.registrationStep = 'CheckSeed'
    },
    checkSeed () {
      this.registrationStep = 'KeyCardPassword'
    },
    async createKeyCard (password) {
      this.loading = true
      let simpleCrypto = new SimpleCrypto(password)
      const bip39 = require('bip39')
      const seed = bip39.mnemonicToSeedSync(this.seedPhrase.join(' ')).toString('hex')
      let dataToEncrypt = {
        phrase: this.seedPhrase.join(' '),
        seed: seed
      }
      this.seed = seed
      let encryptText = simpleCrypto.encrypt(dataToEncrypt)
      localStorage.setItem('cryptoData', encryptText)
      exportFile('SeedPhrase.amh', encryptText)
      this.$emit('actionDone')
      try {
        await this.registrationApi()
          .then(data => {
            this.login = data.data.id
          })
        this.registrationStep = 'PasswordCurrentSession'
      } catch (e) {
        console.log(e)
      }
      this.loading = false
    },
    registrationApi () {
      const MESSAGE_TO_SIGN = 'register'
      let hdKey = bitcore.HDPrivateKey.fromSeed(this.seed)
      let msg = new bitcore.Message(MESSAGE_TO_SIGN)
      let signature = msg.sign(hdKey.privateKey)
      let masterAddress = hdKey.publicKey.toAddress().toString()
      return this.axios.post(apiUrls.registration, {
        pubHash: masterAddress,
        signature: signature
      })
    },
    async getSessionPassword (password, login) {
      this.loading = true
      this.sessionPass = password
      this.sessionLogin = login
      let simpleCrypto = new SimpleCrypto(this.sessionPass)
      const bip39 = require('bip39')
      const seed = bip39.mnemonicToSeedSync(this.seedPhrase.join(' ')).toString('hex')
      let dataToEncrypt = {
        phrase: this.seedPhrase.join(' '),
        seed: seed
      }
      let encryptText = simpleCrypto.encrypt(dataToEncrypt)
      localStorage.setItem('cryptoData', encryptText)
      this.seedSession = seed
      try {
        await this.loginApi()
          .then(data => {
            this.token = data.data.token
            localStorage.setItem('sessionToken', this.token)
            this.$store.commit('User/setProfile', true)
            this.$store.dispatch('UserWallet/addMissingWallets', this.seed)
            setTimeout(() => {
              this.$router.push({ name: 'SettingsUser' })
            }, 100)
            this.$root.$emit('checkLang')
          })
      } catch (e) {
        console.log(e)
      }
      this.loading = false
    },
    loginApi () {
      this.loading = true
      const MESSAGE_TO_SIGN = 'login'
      let hdKey = bitcore.HDPrivateKey.fromSeed(this.seedSession)
      let msg = new bitcore.Message(MESSAGE_TO_SIGN)
      let signature = msg.sign(hdKey.privateKey)
      let masterAddress = hdKey.publicKey.toAddress().toString()
      this.loginBody.pubHash = masterAddress
      this.loginBody.signature = signature
      this.loginBody.id = this.sessionLogin
      return this.axios.post(apiUrls.login, this.loginBody)
    }
  }
}
</script>

<style scoped lang="scss">
    .wrapper_login {
        height: 50%;
    }
</style>
