<template>
  <div class="breadcrumbs container">
    <template v-if="routeName ==='CryptoWallet'">
      <router-link :to="{name: 'Wallet'}"
                   class="breadcrumbs-back"><svg xmlns="http://www.w3.org/2000/svg"
                                                 transform="rotate(-90)" xmlns:xlink="http://www.w3.org/1999/xlink" width="6" height="9" viewBox="0 0 6 9"><defs><path id="c2bxa" d="M360.5 198.1l3.6-3.6 3.6 3.6"/></defs><g><g transform="translate(-361 -192)"><use fill="#fff" fill-opacity="0" stroke="#4a4a4a" stroke-miterlimit="50" stroke-width="1.5" xlink:href="#c2bxa"/></g></g></svg>
        {{$t('breadcrumbs.back')}}
      </router-link>
        <div class="breadcrumbs-info">
          <span class="q-mr-md">{{$t('breadcrumbs.wallet')}}</span>
          <collor-currency-svgs style="height: 20px" :currency="currency.toUpperCase()"></collor-currency-svgs>
          <span class="breadcrumbs-currency-name">{{fullName}}</span>
        </div>
    </template>
    <template v-else>
      <router-link :to="routeName ==='SettingsUser' ? {name: 'Wallet'} : `/${crypto.toLowerCase()}`"
                   class="breadcrumbs-back"><svg xmlns="http://www.w3.org/2000/svg"
                                                 transform="rotate(-90)" xmlns:xlink="http://www.w3.org/1999/xlink" width="6" height="9" viewBox="0 0 6 9"><defs><path id="c2bxa" d="M360.5 198.1l3.6-3.6 3.6 3.6"/></defs><g><g transform="translate(-361 -192)"><use fill="#fff" fill-opacity="0" stroke="#4a4a4a" stroke-miterlimit="50" stroke-width="1.5" xlink:href="#c2bxa"/></g></g></svg>
        {{$t('breadcrumbs.back')}}
      </router-link>
      <template v-if="breadcrumbs.length">
        <div
          v-for="(crumb, key, i) in breadcrumbs"
          :key="i"
          class="crumb"
        >
          <template v-if="crumb.isCrypto">
            <button v-if="crypto" @click="goToCurrency" class="breadcrumbs-currency">
              <collor-currency-svgs :currency="crypto"></collor-currency-svgs>
              <span class="breadcrumbs-currency-name">{{fullCurrencyName}}</span>
            </button>
          </template>
          <template v-else-if="crumb.link">
            <router-link class="breadcrumbs-link" :to="crumb.link">{{$t(`breadcrumbs.${crumb.name}`)}}</router-link>
          </template>
          <template v-else-if="crumb.param">
            <div class="breadcrumbs-info">
              <div class="arrow-space">
                <img src="./../../assets/resources/icons/long-arrow-r.svg" alt="">
              </div>
              <div class="content-space">
                {{crumb.paramVal || getValue(crumb.param)}}
              </div>
            </div>
          </template>
          <template v-else>
            <div class="breadcrumbs-info">
              {{$t(`breadcrumbs.${crumb.name}`)}}
            </div>
          </template>
        </div>
      </template>
    </template>
  </div>
</template>
<script>
import { COINS_NAMES } from '../../constants/coinsMap'
import CollorCurrencySvgs from './CollorCurrencySvgs'
export default {
  name: 'Breadcrumbs',
  components: { CollorCurrencySvgs },
  data () {
    return {
      breadcrumbs: []
    }
  },
  props: {
    routeName: {
      type: String
    },
    currency: {
      type: String
    }
  },
  methods: {
    getValue (param) {
      if (this.$route.params[param]) {
        return this.$route.params[param]
      }
      return ''
    },
    goToCurrency () {
      this.$router.push(`/${this.crypto.toLowerCase()}`)
    }
  },
  computed: {
    crypto () {
      return this.$store.getters.crypto
    },
    fullCurrencyName () {
      return COINS_NAMES[this.crypto] || ''
    },
    fullName () {
      return COINS_NAMES[this.currency.toUpperCase()] || ''
    }
  },
  mounted () {
    this.breadcrumbs = this.$route.meta.breadcrumbs || []
  }
}
</script>
<style lang="scss" scoped>
  .breadcrumbs{
    width: 100%;
    height: 34px;
    display: flex;
    justify-content: flex-start;
    background-color: #f5f5f5;
    margin-bottom: 40px;
    font-family: "Avenir Next Cyr Demi", sans-serif;
    .breadcrumbs-back{
      height: 100%;
      padding: 0 20px;
      display: flex;
      align-items: center;
      border: none;
      cursor: pointer;
      background-color: #f0f0f0;
      color: #41464a;
      font-size: 13px;
      letter-spacing: 0.14px;
      font-family: "Avenir Next Cyr Demi", sans-serif;
      svg{
        margin-right: 15px;
      }
    }
    .breadcrumbs-link{
      height: 100%;
      padding: 0 20px;
      display: flex;
      align-items: center;
      border: none;
      cursor: pointer;
      color: #41464a;
      font-size: 13px;
      letter-spacing: 0.14px;
      font-family: "Avenir Next Cyr Demi", sans-serif;
      border-right: 1px solid #97979720;
    }
    .breadcrumbs-currency{
      height: 100%;
      background-color: transparent;
      padding: 0 20px;
      display: flex;
      align-items: center;
      font-family: "Avenir Next Cyr Demi", sans-serif;
      border: none;
      cursor: pointer;
      color: #41464a40;
      border-right: 1px solid #97979720;
    }

    .breadcrumbs-currency-name{
      margin-left: 15px;
      white-space: nowrap;
    }

    .breadcrumbs-info{
      width: 100%;
      display: flex;
      align-items: center;
      color: #41464a40;
      font-size: 13px;
      font-weight: 600;
      letter-spacing: 0.14px;
      height: 100%;
      padding-left: 20px;
    }
    .arrow-space{
      margin-left: -10px;
      margin-top: 1px;
    }
    .content-space{
      padding-left: 10px;
    }
    .crumb{
      display: flex;
      align-items: center;
    }
  }
</style>
