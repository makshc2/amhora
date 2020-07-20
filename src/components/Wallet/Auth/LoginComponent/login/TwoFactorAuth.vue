<template>
    <div class="col-6">
        <div style="width: 500px"
                class="column justify-center">
            <q-card-section class="text-center">
                <div class="q-mt-lg">{{$t('login.app_info')}}</div>
                <div class="icon-size row justify-between q-pt-md no-wrap">
                    <q-btn icon="fab fa-apple" outline dense class="fs-14 q-px-sm" label="App store"
                           @click="openApp('appStore')"/>
                    <q-btn icon="fab fa-google-play" dense class="fs-14 q-px-sm" outline label="Google play"
                           @click="openApp('google')"/>
                </div>
                <div class="q-py-md">{{$t('login.type_code')}}</div>
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
                <div class="q-mt-md underline_link cursor-pointer">
<!--                    <router-link :to="{name:'OneTimePassword'}">{{$t('login.enter_email')}}</router-link>-->
                  <div>{{$t('login.enter_email')}}</div>
                </div>
                <div class="row justify-center">
                    <q-btn @click="validateCode" :disable="!code" :label="$t('global.verify')" color="black"
                           class="q-mt-lg q-px-lg"/>
                </div>
            </q-card-section>
        </div>
    </div>
</template>

<script>
import apiUrls from '@/services/api-urls'

export default {
  name: 'TwoFactorAuth',
  props: {
    login: {
      type: String
    },
    code2fa: {
      type: String
    },
    token: {
      type: String
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
    async validateCode () {
      if ((await this.$refs.code.validate()).valid) {
        try {
          await this.axios.post(apiUrls.profile_2fa, {
            code: this.code
          }, {
            headers: { 'X-Auth-Token': this.token }
          })
          localStorage.setItem('sessionToken', this.token)
          this.$store.commit('User/setProfile', true)
          this.$router.push({ name: 'SettingsUser' })
          this.$store.commit('ModalDialogService/closeDialog')
        } catch ({ data }) {
          return this.$refs.code.setErrors([this.$t('validation_errors.wrong_code')])
        }
        // this.activeTab = 'save_codes'
        // const {data: codes} =  await this.axios.get(api_urls.new_codes2fa)
        // this.codes = Object.keys(codes)
      }
    }
  }
}
</script>

<style scoped>
    .underline_link {
        text-decoration: underline;
    }
</style>
