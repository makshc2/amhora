<template>
  <div class="col-6">
    <q-card
      class="column justify-center"
      style="width: 420px">
      <q-card-section class="text-center">
        <div class="fs-15 text-bold q-mb-lg">{{$t('registration.upload_keycard')}}</div>
        <DragNDrop/>
        <div class="fs-15 text-bold q-mt-lg q-mb-sm">{{$t('registration.enter_password')}}</div>
        <q-input
          filled
          type="password"
          autocomplete="new-password"
          dense outlined field no-error-icon
          color="black"
          v-model="passwordSeedPhrase"
          class="q-mb-lg"
          :label="$t('global.password')"
        />
        <q-slide-transition>
          <span v-show="passwordError" class="text-red">{{$t('validation_errors.wrong_password')}}</span>
        </q-slide-transition>
        <q-btn @click="decryptoSeedPhrase"
               color="grey-9"
               class="full-width q-mt-md custom-border-radius-5 text-capitalize"
               :label="$t('global.verify')"
               :disable="!passwordSeedPhrase || !cryptoSeedPhrase"
        />
        <q-btn color="white"
               class="full-width q-mt-md custom-border-radius-5 text-black text-capitalize"
               :label="$t('global.back')"
               @click="$router.push({name: 'WelcomePage'})"
        />
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
import DragNDrop from '../../../commonUI/DragNDrop'
import SimpleCrypto from 'simple-crypto-js'

export default {
  name: 'DragNDropFile',
  components: {
    DragNDrop
  },
  data () {
    return {
      passwordError: false,
      cryptoSeedPhrase: '',
      passwordSeedPhrase: '',
      seedPhrase: ''
    }
  },
  methods: {
    decryptoSeedPhrase () {
      this.passwordError = false
      let simpleCrypto = new SimpleCrypto(this.passwordSeedPhrase)
      try {
        this.seedPhrase = simpleCrypto.decrypt(this.cryptoSeedPhrase)
        this.$emit('recoverSeed', this.seedPhrase)
      } catch (e) {
        this.passwordError = true
      }
    }
  },
  created () {
    this.$root.$on('crypto-seed-phrase', (data) => {
      this.cryptoSeedPhrase = data
    })
  }
}
</script>

<style scoped>

</style>
