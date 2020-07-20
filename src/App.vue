<template>
  <div id="app">
    <div v-if="!isloaded">
      <static-navigation v-if="this.$store.getters['getCentrifugeConnection']"></static-navigation>
    </div>
    <div class="logo-wrapper" v-else>
      <img src="../src/assets/resources/img/logo.svg" alt="logo" class="logo_style">
    </div>
    <BaseModalDialog />
  </div>
</template>

<script>
import StaticNavigation from './components/StaticNavigation.vue'
import { SET_TOKEN } from '@/services/requests'
import Centrifuge from 'centrifuge'
import { config } from '@/GlobalConfig'
import BaseModalDialog from './components/commonUI/BaseModalDialog'
import apiUrls from '@/services/api-urls'
import moment from 'moment'

export default {
  data () {
    return {
      isloaded: true,
      token: '',
      lang: {
        name: 'ENG',
        label: 'English',
        fullName: 'English',
        img: 'LanguageEN.png',
        value: 'en',
        moment: 'en-gb'
      },
      langOptions: [
        {
          name: 'ENG',
          label: 'English',
          fullName: 'English',
          img: 'LanguageEN.png',
          value: 'en',
          moment: 'en-gb'
        },
        {
          name: 'RU',
          label: 'Russian',
          fullName: 'Russian',
          img: 'LanguageRU.png',
          value: 'ru',
          moment: 'ru'
        }
      ],
      fiat: ''
    }
  },
  name: 'App',
  components: { StaticNavigation, BaseModalDialog },
  methods: {
    setToken () {
      SET_TOKEN()
        .then(res => {
          let centrifuge = new Centrifuge(config.centrifugeLink)
          centrifuge.setToken(res.token)
          centrifuge.connect()
          this.$store.commit('SET_CF_CONNECTION', centrifuge)
        })
    },
    loader () {
      if (!localStorage.loaded) {
        this.isloaded = true
        setInterval(() => {
          this.isloaded = false
          localStorage.loaded = 'loading'
        }, 3000)
      } else {
        this.isloaded = false
      }
    },
    checkUserInfo () {
      if (localStorage.sessionToken) {
        this.axios.get(apiUrls.profile)
          .then(data => {
            this.language = data.data.language
            this.fiat = data.data.fiat.toUpperCase()
            this.$store.commit('CHANGE_FIAT', this.fiat)
            if (this.language === 'en') {
              this.lang = this.langOptions[0]
            } else {
              this.lang = this.langOptions[1]
            }
            this.$i18n.set(this.lang.value)
            moment.locale(this.lang.value)
            this.$store.commit('SET_LANGUAGE', this.lang.value)
          })
      }
    }
  },
  created () {
    this.setToken()
    this.loader()
    this.checkUserInfo()
    window.addEventListener('beforeunload', () => {
      this.centrifuge.close()
    })
    this.$store.commit('SET_CRYPTO', this.$route.params.currency)
  }
}
</script>

<style scoped>
  #app {
    width: 100%;
    height: 100%;
  }

  .logo-wrapper {
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #EFEFEF;
  }

  .logo_style {
    display: block;
    width: 300px;
    height: 300px;
  }
</style>
