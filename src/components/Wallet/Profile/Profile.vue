<template>
    <div class="column justify-between full-height">
        <q-slide-transition :duration="500">
            <router-view></router-view>
        </q-slide-transition>
    </div>
</template>

<script>
import apiUrls from '../../../services/api-urls'
import moment from 'moment'

export default {
  name: 'Profile',
  data () {
    return {
      fiat: '',
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
      ]
    }
  },
  methods: {
    checkUserInfo () {
      this.axios.get(apiUrls.profile)
        .then(data => {
          this.fiat = data.data.fiat.toUpperCase()
          if (!localStorage.checkFiat) {
            this.$store.commit('CHANGE_FIAT', this.fiat)
            localStorage.setItem('checkFiat', this.fiat)
          }
          this.language = data.data.language
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
  },
  created () {
    this.checkUserInfo()
  }
}
</script>

<style scoped>

</style>
