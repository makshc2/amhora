<template>
  <div class="left-navbar">
    <div class="logo">
      <div>
        <img class="logo-img" :src="require('@/assets/resources/icons/left-sidebar/logo.svg')" alt="amhora logo"/>
      </div>
      <div class="beta-wrap">
        <img class="beta" :src="require('@/assets/resources/img/beta.png')" alt="amhora logo"/>
      </div>
    </div>
    <nav class="left-navbar-links">
      <router-link
        :to="{ path: '/wallet' }"
        class="left-navbar-link"
      >
        <img src="@/assets/resources/icons/left-sidebar/wallet.svg" alt="wallet" class="left-navbar-links-img"/>
        <h2 class="navigation_button">{{$t('static_navigation.wallet')}}</h2>
      </router-link>
      <router-link
        :to="{ path: `/${crypto.toLowerCase()}` }"
        class="left-navbar-link"
      >
        <img src="@/assets/resources//icons/left-sidebar/explorer.svg" alt="explorer" class="left-navbar-links-img"/>
        <h2 class="navigation_button">{{$t('static_navigation.explorer')}}</h2>
      </router-link>
      <router-link
        :to="{ path: `/market/${crypto.toLowerCase()}` }"
        class="left-navbar-link"
      >
        <img src="@/assets/resources//icons/left-sidebar/market.svg" alt="market" class="left-navbar-links-img"/>
        <h2 class="navigation_button">{{$t('static_navigation.market')}}</h2>
      </router-link>
      <router-link
        :to="{ path: '/statistics' }"
        class="left-navbar-link"
      >
        <img src="@/assets/resources//icons/left-sidebar/statistic.svg" alt="statistics" class="left-navbar-links-img"/>
        <h2 class="navigation_button">{{$t('static_navigation.statistics')}}</h2>
      </router-link>
    </nav>
    <div class="footer-left" v-if="!this.token">
      <localization></localization>
    </div>
  </div>
</template>

<script>
  import Localization from './Localization'

  export default {
    name: 'LeftNavigation',
    components: { Localization },
    data () {
      return {
        nameWebSite: 'Amhora',
        token: ''
      }
    },
    computed: {
      crypto () {
        return this.$store.getters.crypto
      }
    },
    methods: {
      checkSessionToken () {
        this.token = localStorage.sessionToken
      }
    },
    created () {
      this.$root.$on('checkLang', () => {
        this.checkSessionToken()
      })
      this.checkSessionToken()
    }
  }
</script>

<style lang="scss" scoped>
  .navigation_button {
    line-height: normal;
  }
  .left-navbar {
    align-self: flex-end;
    position: sticky;
    bottom: 0;
    min-height: 110vh;
    padding-top: 26px;
    min-width: 240px;
    width: 240px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    border-right: 1px solid #97979720;
    padding-bottom: 40px;
    background: #efefef url("../assets/resources/img/bg.png") no-repeat;
  }

  .left-navbar > div,
  .left-navbar > nav {
    flex-shrink: 0;
  }

  .logo {
    width: 100%;
    height: 160px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    position: relative;
  }

  .beta-wrap {
    padding-top: 22px;
    .beta {
      border-radius: 2px;
      max-width: 71px;
      height: 22px;
      text-align: center;
    }
  }

  .left-navbar-links {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 33px;
    margin-bottom: 519px;
  }

  .left-navbar-link {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    flex-shrink: 0;
    width: 120px;
    height: 120px;
    background-color: transparent;
    transition: background-color .4s;
    margin-bottom: 12px;
    border: 0;
    cursor: pointer;
    font-size: 15px;
    font-family: "Avenir Next Cyr Demi", sans-serif;
    color: #41464a;
    opacity: 0.6;

    &:hover, &.router-link-active {
      background-color: #fafafa;
      transition: background-color .4s;
      color: #41464a;
      opacity: 1;
      border-radius: 2px;

      .left-navbar-links-img {
        transition: opacity .4s;
      }
    }
  }

  .left-navbar-links-img {
    width: 20px;
    height: 21px;
    transition: opacity .4s;
    margin-bottom: 8px;
    position: relative;

    &::after {
      content: "";
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
    }
  }

  .left-navbar-link {
    background-color: transparent;
    transition: background-color .4s;
  }

  .footer-left {
    width: 120px;
    display: flex;
    flex-direction: column;
    margin: auto auto 0 auto;
  }
  .left-navbar-link > h2{
    cursor: pointer;
    margin: 0;
    font-size: 15px;
    font-family: "Avenir Next Cyr Demi", sans-serif;
    color: #41464a;
  }
</style>
