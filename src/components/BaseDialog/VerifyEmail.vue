<template>
    <div class="q-px-md q-py-lg avenir-font-family">
        <div class="title fs-15 text-center q-mb-lg">We have sent a letter to you. Please confirm that it`s your email
            by entering the password from the letter in the field below.
        </div>
        <ValidationProvider
                tag="div"
                mode="lazy"
                ref="code"
                rules="required"
                v-slot="{ errors, reset, invalid, validated}">
            <q-input
                    v-model="code"
                    :placeholder="$t('global.code')"
                    @focus="reset"
                    :error="invalid && validated"
                    unmasked-value
                    :error-message="errors[0]"
                    class="q-pb-none"
                    dense outlined field no-error-icon color="dark" bottom-slots
            />
        </ValidationProvider>
        <div class="row justify-center q-gutter-x-lg q-mt-md">
            <q-btn
                    :loading="loading1"
                    @click="resendCode"
                    :label="$t('global.resend')"
                    color="white"
                    class="q-mt-md text-capitalize text-black"
                    :style="loading1?'width: 200px':''"
            >
                <template v-slot:loading>
                    Wait {{currentTime}} second for resend
                </template>
            </q-btn>
            <q-btn @click="sendCode"
                   :label="$t('global.confirm')"
                   color="black"
                   class="q-mt-md text-capitalize "/>

        </div>
    </div>
</template>

<script>
import apiUrls from '@/services/api-urls'

export default {
  name: 'VerifyEmail',
  data () {
    return {
      code: '',
      loading1: false,
      currentTime: 60,
      timer: null
    }
  },
  methods: {
    setTimer () {
      this.loading1 = true
      this.timer = setInterval(() => {
        this.currentTime--
        if (this.currentTime === 0) {
          clearInterval(this.timer)
          this.loading1 = false
          this.currentTime = 60
        }
      }, 1500)
    },
    resendCode () {
      this.axios.get(apiUrls.resend_email)
        .then(() => {
          this.setTimer()
        })
    },
    sendCode () {
      this.axios.post(apiUrls.resend_email, {
        code: this.code
      })
        .then(() => {
          this.$store.commit('ModalDialogService/closeDialog')
        })
        .catch((e) => {
          return this.$refs.code.setErrors([this.$t('validation_errors.wrong_code')])
        })
    }
  },
  created () {
    this.setTimer()
  },
  beforeDestroy () {
    clearInterval(this.timer)
    this.$root.$emit('updateProfile')
  }
}
</script>

<style scoped>

</style>
