<template>
  <div class="localization">
    <div class="select">
      <button @click="openCloseSelect" class="language-button" v-bind:class="{openSelect:isSelectOpen}">
        <img class="flag" :src="require(`@/assets/resources/img/${language.img}`)"/>{{language.name}}
      </button>
      <div
        class='options-language'
        v-if="isSelectOpen"
        v-on-click-outside="openCloseSelect"
      >
        <div v-for="item in languages"
             :key="item.index"
             class="option-language"
             @click="selectLanguage(item)"
        >
          <img class="flag" :src="require(`@/assets/resources/img/${item.img}`)"/>{{item.name}}
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import language from '../assets/resources/Languages.json'
import moment from 'moment'
export default {
  name: 'Localization',
  components: {},
  data () {
    return {
      language: {},
      languages: language,
      isSelectOpen: false
    }
  },
  methods: {
    openCloseSelect () {
      this.isSelectOpen = !this.isSelectOpen
    },
    selectLanguage (language) {
      if (language.value !== this.language.value) {
        this.language.name = language.name
        this.language.img = language.img
        this.language.value = language.value
        localStorage.language = this.language.value
        localStorage.languageName = this.language.name
        localStorage.languageImg = this.language.img
        this.$store.commit('SET_LANGUAGE', language.value)
        this.$i18n.set(language.value)
        moment.locale(language.value)
      }
      this.isSelectOpen = false
    },
    checkLanguage () {
      if (localStorage.language) {
        this.language.name = localStorage.languageName
        this.language.img = localStorage.languageImg
        this.language.value = localStorage.language
        this.$i18n.set(this.language.value)
        moment.locale(this.language.value)
      } else {
        this.language.name = this.languages[this.$store.getters.language].name
        this.language.img = this.languages[this.$store.getters.language].img
        this.language.value = this.$store.getters.language
      }
    }
  },
  created () {
    this.checkLanguage()
  }
}
</script>
<style scoped>
  .localization {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 54px;
    margin: 0 auto;
  }

  .language-button {
    width: 100%;
    border: none;
    color: black;
    display: flex;
    align-items: center;
    background-color: transparent;
    outline-style: none;
    cursor: pointer;
    padding: 3px;
    font-size: 13px;
    font-family: "Avenir Next Cyr Demi", sans-serif;
    text-transform: uppercase;
    margin: 0;
  }

  .language-button:hover {
    background: #e2e2e260;
  }

  .language-button:active {
    background: #d4d4d460;
  }

  .options-language {
    padding: 5px;
    background-color: #fff;
    position: absolute;
    display: flex;
    flex-direction: column;
    left: -5px;
    bottom: 25px;
    font-family: "Avenir Next Cyr Demi", sans-serif;
    border-radius: 5px;
  }

  .option-language {
    min-width: 54px;
    display: flex;
    align-items: center;
    border: none;
    color: black;
    background: none;
    outline-style: none;
    cursor: pointer;
    padding: 3px;
    font-size: 13px;
    font-weight: 600;
  }

  .option-language:hover {
    background: #e2e2e260;
  }

  .option-language:active {
    background: #d4d4d460;
  }

  .openSelect {
    background-color: #e6e6e6;
  }

  .flag {
    width: 16px;
    height: auto;
    object-fit: fill;
    margin-right: 8px;
  }
</style>
