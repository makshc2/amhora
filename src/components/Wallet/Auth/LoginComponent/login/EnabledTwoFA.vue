<template>
    <div class="col-6">
        <q-card
                class="column justify-center"
                style="width: 420px">
            <q-card-section class="text-center">
                <qrcode-vue v-if="activate2FA && !isActive"
                            :value="qrSecret"
                            :size="110"
                            background="#fff"
                            level="H"
                />
                <div class="q-mt-lg">
                    {{$t('login.app_info')}}
                </div>
                <div class="icon-size row justify-between q-pt-md no-wrap">
                    <q-btn icon="fab fa-apple"
                           dense
                           class="fs-14 q-px-sm"
                           outline
                           label="App store"
                           @click="openApp('appStore')"
                    />
                    <q-btn icon="fab fa-google-play"
                           dense
                           class="fs-14 q-px-sm"
                           outline
                           label="Google play"
                           @click="openApp('google')"
                    />
                </div>
                <div class="q-py-md">
                    {{$t('login.type_code')}}
                </div>
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
                            dense outlined field no-error-icon
                            color="dark"
                            bottom-slots
                    />
                </ValidationProvider>
                <div class="q-mt-md underline_link">
                    <router-link :to="{name:'OneTimePassword'}">
                        {{$t('login.enter_email')}}
                    </router-link>
                </div>
                <q-slide-transition>
                    <div v-show="showing"
                         class="text-green text-bold"
                    >
                        {{$t('global.saved')}}
                    </div>
                </q-slide-transition>
                <div class="row justify-center">
                    <q-btn @click="enabled2Fa"
                           :disable="!code"
                           :label="$t('global.save')"
                           color="black"
                           class="q-mt-md q-px-lg"
                    />
                </div>
            </q-card-section>
        </q-card>
    </div>
</template>

<script>
import QrcodeVue from 'qrcode.vue'
import apiUrls from '@/services/api-urls'
import { mapMutations } from 'vuex'

export default {
  components: {
    QrcodeVue
  },
  props: {
    login: {
      type: String
    },
    code2fa: {
      type: String
    },
    activate2FA: {
      type: Boolean
    },
    isActive: {
      type: Boolean
    }
  },
  data () {
    return {
      showing: false,
      showingQR: false,
      qrSecret: '',
      code: '',
      check2fa: Boolean
    }
  },
  methods: {
    ...mapMutations('ModalDialogService', ['openModalDialog', 'closeDialog']),
    get2FAcode () {
      this.axios.get(apiUrls.profile_2fa)
        .then(({ data }) => {
          this.qrSecret = data.secret
        })
    },
    openApp (app) {
      const urls = {
        google: 'https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2',
        appStore: 'https://apps.apple.com/ru/app/google-authenticator/id388497605'
      }
      window.open(urls[app])
    },
    async enabled2Fa () {
      if ((await this.$refs.code.validate()).valid) {
        try {
          if (this.activate2FA) {
            await this.axios.put(apiUrls.profile_2fa, {
              code: this.code
            })
          } else {
            await this.axios.delete(apiUrls.profile_2fa, {
              data: {
                code: this.code
              }
            })
          }
          this.showing = true
          setTimeout(() => {
            this.showing = false
          }, 2000)
          this.$emit('actionDone')
          this.$emit('update_info')
          // this.$router.push({name: 'Profile'})
        } catch (e) {
          if (e.response.data.code === 'INVALID_OTP_CODE') {
            return this.$refs.code.setErrors([this.$t('validation_errors.wrong_code')])
          }
        }
      }
    }
  },
  created () {
    if (this.activate2FA && !this.isActive) {
      this.get2FAcode()
    }
  }
}
</script>

<style scoped>
    .underline_link {
        text-decoration: underline;
    }
</style>
