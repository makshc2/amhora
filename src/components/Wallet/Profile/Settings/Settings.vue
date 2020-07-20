<template>
    <div class="column">
        <breadcrumbs :routeName='$route.name' class="no-margin" style="max-width: 100%"></breadcrumbs>
        <Preferences :oldEmail = "oldEmail"
                     :emailConfirmed="emailConfirmed"
                     @updateProfile='getProfile'
                     class="q-mt-lg"
        />
        <q-separator class="q-my-xl"></q-separator>
        <WalletSettings :login="login"/>
        <q-separator class="q-my-xl"></q-separator>
        <Security :enabled2fa="enabled2fa" :sessionTime="sessionTime"/>
    </div>
</template>

<script>
import Preferences from './Preferences'
import WalletSettings from './WalletSettings'
import Security from './Security'
import Breadcrumbs from '../../../commonUI/Breadcrumbs'
import apiUrls from '@/services/api-urls'

export default {
  name: 'SettingsUser',
  components: {
    Preferences,
    WalletSettings,
    Security,
    Breadcrumbs
  },
  data () {
    return {
      login: [],
      language: '',
      enabled2fa: '',
      emailConfirmed: '',
      oldEmail: '',
      sessionTime: null
    }
  },
  methods: {
    getProfile () {
      this.axios.get(apiUrls.profile)
        .then(data => {
          this.oldEmail = data.data.email
          this.login = [data.data.id]
          this.language = data.data.language
          this.enabled2fa = data.data.enabled2fa
          this.emailConfirmed = data.data.emailConfirmed
          this.sessionTime = data.data.sessionDuration
        }).catch(e => console.log(e))
    }
  },
  created () {
    this.getProfile()
    this.$root.$on('updateProfile', () => {
      this.getProfile()
    })
  }
}
</script>
