<template>
    <div class="q-pa-lg">
        <div class="row justify-center q-pb-md">
            <div class="fs-18 text-bold">{{$t('settings.confirm_pass')}}</div>
        </div>
        <q-separator color="gray-5"/>
        <div class="fs-14 text-center q-py-md">
            <div v-if="!payload.getSeedPhrase">{{$t('settings.delete_info')}}</div>
            <div>{{$t('settings.enter_pass')}}</div>
        </div>
        <q-input filled
                type="password"
                autocomplete="new-password"
                dense outlined field no-error-icon
                color="black"
                v-model="password"
                :label="$t('global.password')"
                class="q-pb-lg"
                :error="!!error"
                @input="error = ''"
        >
            <template #error>
                <span class="fs-14 full-width text-red text-center">{{error}}</span>
            </template>
        </q-input>
        <div class="full-width row q-gutter-x-lg">
            <q-btn @click="confirmPassword"
                   color="grey-9"
                   class="col-5 q-mt-lg custom-border-radius-5 text-capitalize"
                   :label="$t('global.confirm')"
                   :disable="!password"
            />
            <q-btn @click="cancel"
                   color="red"
                   class="col-5 q-mt-lg custom-border-radius-5 text-capitalize"
                   :label="$t('global.cancel')"
            />
        </div>
    </div>
</template>

<script>
import SimpleCrypto from 'simple-crypto-js'
export default {
  name: 'ConfirmPassword',
  props: {
    payload: {
      type: Object
    }
  },
  data () {
    return {
      password: '',
      error: ''
    }
  },
  methods: {
    confirmPassword () {
      try {
        let cryptoPhrase = localStorage.getItem('cryptoData')
        let simpleCrypto = new SimpleCrypto(this.password)
        let cryptoData = simpleCrypto.decrypt(cryptoPhrase)
        if (!cryptoData) {
          this.error = 'Invalid password'
          return
        }
        if (this.payload.getSeedPhrase) {
          this.$root.$emit('getSeed', cryptoData)
        } else {
          this.$root.$emit('confirmPassword', cryptoData)
        }
        this.$store.commit('ModalDialogService/closeDialog')
      } catch (e) {
        this.error = 'Invalid password'
      }
    },
    cancel () {
      this.$store.commit('ModalDialogService/closeDialog')
    }
  }
}
</script>

<style scoped>

</style>
