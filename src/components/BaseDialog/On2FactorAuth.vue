<template>
    <div class="q-px-md q-py-lg avenir-font-family">
        <div class="title fs-18 q-mb-lg">Google authenticator</div>
        <div class="row justify-around">
            <div class="column">
                <span class="text-grey-6">01</span>
                <span class="fs-14 text-grey-8 q-mb-sm text-justify" style="max-width: 230px">{{payload.showQR ? $t('settings.download_app') : $t('settings.off_two_fa')}}</span>
                <div class="column" v-if="payload.showQR">
                    <q-btn icon="fab fa-apple" outline dense class="fs-14 q-px-sm text-capitalize q-my-md" label="App store"
                           @click="openApp('appStore')"/>
                    <q-btn icon="fab fa-google-play" dense class="fs-14 q-px-sm text-capitalize" outline label="Google play"
                           @click="openApp('google')"/>
                </div>
            </div>
            <q-separator v-if="payload.showQR" vertical inset/>
            <div v-if="payload.showQR" class="column">
                <span class="text-grey-6">02</span>
                <span class="fs-14 text-grey-8 q-mb-lg">{{$t('settings.scan_code')}}</span>
                <qrcode-vue :value="qrSecret"
                            :size="110"
                            background="#fff"
                            level="H"
                />
<!--                <span class="info fs-14 text-grey-5 q-mt-lg">-->
<!--                    {{$t('settings.code_info')}}-->
<!--                </span>-->
            </div>
            <q-separator vertical inset/>
            <div class="column">
                <span class="text-grey-6">{{payload.showQR ? '03' : '02'}}</span>
                <span class="fs-14 text-grey-8 q-mb-lg">{{$t('settings.six_digit')}}</span>
                <ValidationProvider
                        tag="div"
                        mode="lazy"
                        ref="code"
                        rules="required"
                        v-slot="{ errors, reset, invalid, validated}">
                    <q-input
                            v-model="code"
                            @focus="reset"
                            :placeholder="$t('global.code')"
                            :error="invalid && validated"
                            mask="######"
                            unmasked-value
                            :error-message="errors[0]"
                            class="q-pb-none"
                            dense outlined field no-error-icon color="dark" bottom-slots
                    />
                </ValidationProvider>
                <div class="row justify-between q-mt-lg">
                    <q-btn @click="cancel"
                           :label="$t('global.cancel')"
                           color="white"
                           class="q-mt-md text-capitalize text-black"/>
                    <q-btn @click="save2FA"
                           :disable="code.length !== 6"
                           :label="$t('global.confirm')"
                           color="black"
                           class="q-mt-md text-capitalize"/>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import QrcodeVue from 'qrcode.vue'
import apiUrls from '@/services/api-urls'

export default {
  name: 'On2FactorAuth',
  components: {
    QrcodeVue
  },
  props: {
    payload: {
      type: Object
    }
  },
  data () {
    return {
      qrSecret: '',
      code: ''
    }
  },
  methods: {
    openApp (app) {
      const urls = {
        google: 'https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2',
        appStore: 'https://apps.apple.com/ru/app/google-authenticator/id388497605'
      }
      window.open(urls[app])
    },
    cancel () {
      this.$store.commit('ModalDialogService/closeDialog')
      this.$root.$emit('updateProfile')
    },
    async save2FA () {
      if ((await this.$refs.code.validate()).valid) {
        try {
          if (this.payload.showQR) {
            await this.axios.put(apiUrls.profile_2fa, {
              code: this.code
            })
              .then(() => {
                this.$store.commit('ModalDialogService/closeDialog')
              })
          } else {
            await this.axios.delete(apiUrls.profile_2fa, {
              data: {
                code: this.code
              }
            })
              .then(() => {
                this.$store.commit('ModalDialogService/closeDialog')
              })
          }
        } catch (e) {
          console.log(e)
          if (e.data.code === 'INVALID_OTP_CODE') {
            return this.$refs.code.setErrors([this.$t('validation_errors.wrong_code')])
          }
        }
      }
    },
    get2FAcode () {
      this.axios.get(apiUrls.profile_2fa)
        .then(({ data }) => {
          this.qrSecret = data.secret
        })
    }
  },
  created () {
    if (this.payload.showQR) {
      this.get2FAcode()
    }
  }
}
</script>

<style scoped>

</style>
