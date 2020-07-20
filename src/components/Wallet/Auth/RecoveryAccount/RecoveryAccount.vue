<template>
    <div class="flex justify-end full-height">
        <div class="wrapper_login flex justify-center content-center q-mt-xl">
            <component :is="recoverStep"
                       :signature="signature"
                       :errorFile="errorFile"
                       :error.sync="error"
                       @clearErr="error = ''"
                       @update:error="setError"
                       @addedMnemonicPhrase="addedMnemonicPhrase"
                       @addedAccountFile="addedAccountFile"
            />
        </div>
    </div>
</template>

<script>
import DragNDropAccount from './DragNDropAccount'
import SeedPhraseRecoveryAccount from './SeedPhraseRecoveryAccount'
import apiUrls from '@/services/api-urls'
import bitcore from 'bitcore-lib'
import Mnemonic from 'bitcore-mnemonic'

export default {
  name: 'RecoveryAccount',
  components: {
    DragNDropAccount,
    SeedPhraseRecoveryAccount
  },
  data () {
    return {
      recoverStep: 'SeedPhraseRecoveryAccount',
      accountData: '',
      signature: '',
      errorFile: false,
      error: '',
      seedPhrase: '',
      seedToCrypto: []
    }
  },
  methods: {
    setError (err) {
      this.error = err
    },
    addedMnemonicPhrase (phrase) {
      let seedPhrase = phrase.replace(/\r?\n/g, ' ')
      try {
        this.seedToCrypto = seedPhrase
        this.seedPhrase = new Mnemonic(seedPhrase)
        const MESSAGE_TO_SIGN = 'restore'
        const bip39 = require('bip39')
        const seed = bip39.mnemonicToSeedSync(seedPhrase).toString('hex')
        let hdKey = bitcore.HDPrivateKey.fromSeed(seed)
        let msg = new bitcore.Message(MESSAGE_TO_SIGN)
        this.signature = msg.sign(hdKey.privateKey)
        this.recoverStep = 'DragNDropAccount'
      } catch (e) {
        this.error = this.$t('validation_errors.invalid_mnemonic')
      }
    },
    addedAccountFile (file) {
      this.axios.post(apiUrls.account, {
        data: file
      }, {
        headers: {
          'X-Restore-Signature': this.signature
        }
      })
        .then(() => {
          this.$router.push({ name: 'WelcomePage' })
        })
        .catch(() => {
          this.errorFile = true
          setTimeout(() => {
            this.errorFile = false
          }, 2000)
        })
    }
  }
}
</script>

<style scoped>

</style>
