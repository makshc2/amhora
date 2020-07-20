<template>
    <div class="col-6">
        <q-card
                class="column justify-center"
                style="width: 420px">
            <q-card-section class="text-center">
                <div class="fs-15 q-mb-md">{{$t('login.enter_seed')}}</div>
                <q-input filled
                         type="textarea"
                         v-model.trim="mnemonicPhrase"
                         :error="!!error"
                         :error-messages="error"
                         @input="$emit('clearErr')"
                />
                <q-slide-transition>
                    <div class="text-red fs-14">{{error}}</div>
                </q-slide-transition>
                <q-btn color="grey-9"
                       class="full-width q-mt-lg custom-border-radius-5 text-capitalize"
                       :label="$t('global.verify')"
                       :disable="!mnemonicPhrase"
                       :loading="loadingBtn"
                       @click="validateMnemonic"
                >
                  <template #loading>
                    <q-spinner-facebook />
                  </template>
                </q-btn>
            </q-card-section>
        </q-card>
    </div>
</template>

<script>
export default {
  name: 'SeedPhraseRecoveryAccount',
  data () {
    return {
      mnemonicPhrase: '',
      loadingBtn: false
    }
  },
  props: {
    error: {
      type: String
    },
    loading: {
      type: Boolean
    }
  },
  methods: {
    validateMnemonic () {
      this.loadingBtn = true
      setTimeout(() => {
        this.$emit('addedMnemonicPhrase', this.mnemonicPhrase)
        this.loadingBtn = false
      }, 500)
    }
  }
}
</script>

<style scoped>

</style>
