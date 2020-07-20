<template>
    <div class="flex justify-end full-height">
        <div class="wrapper_login column justify-center content-center q-mt-xl">
            <div class="fs-16 text-bold text-center q-mb-lg">{{$t('login.login')}}</div>
                <component :is="currentStep"
                           @enterLoginId="enterLoginId"
                           :login="login"
                           :token="token"
                           @clearErr="error = ''"
                           @update:error="setError"
                           :error.sync="error"
                >
                </component>
        </div>
    </div>
</template>

<script>
import CheckLoginId from './login/CheckLoginId'
import TwoFactorAuth from './login/TwoFactorAuth'
import apiUrls from '../../../../services/api-urls'

export default {
  name: 'ReadOnlyLogin',
  components: {
    CheckLoginId,
    TwoFactorAuth
  },
  data () {
    return {
      currentStep: 'CheckLoginId',
      loginBody: {},
      login: '',
      error: '',
      token: ''
    }
  },
  methods: {
    setError (err) {
      this.error = err
    },
    getProfile () {
      return this.axios.get(apiUrls.profile, {
        headers: { 'X-Auth-Token': this.token }
      })
    },
    sendLogin (login) {
      return this.axios.post(apiUrls.login, {
        id: login
      })
    },
    async enterLoginId (login) {
      this.login = login
      try {
        let readOnlyLogin = await this.sendLogin(this.login)
        this.token = readOnlyLogin.data.token
        if (this.token) {
          await this.getProfile()
            .then(data => {
              this.enabled2fa = data.data.enabled2fa
            })
          if (this.enabled2fa) {
            this.currentStep = 'TwoFactorAuth'
          } else {
            localStorage.setItem('sessionToken', this.token)
            this.$store.commit('User/setProfile', true)
            this.$router.push({ name: 'UserWallet' })
          }
          this.$root.$emit('checkLang')
        } else {
          this.error = this.$t('validation_errors.user_not_found')
        }
      } catch (e) {
        this.error = this.$t('validation_errors.user_not_found')
      }
    }
  }
}
</script>

<style scoped>

</style>
