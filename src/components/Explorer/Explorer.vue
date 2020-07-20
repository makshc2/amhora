<template>
  <div class="middle-part">
    <div class="content-title">
      <currency-buttons v-if="this.$store.getters['getCentrifugeConnection']"></currency-buttons>
    </div>
    <div class="content-middle">
      <div class="explorer">
        <div class="search-info">
          <div class="info">
            <router-view :key="this.$route.path"></router-view>
          </div>
        </div>
      </div>
    </div>
    <general-statistics v-if="this.$store.getters['getCentrifugeConnection']"></general-statistics>
  </div>
</template>
<script>
import CurrencyButtons from '../CurrencyButtons.vue'
import GeneralStatistics from '../GeneralStatistics.vue'

export default {
  name: 'Explorer',
  props: {
    currency: {
      required: false,
      default: 'btc'
    }
  },
  components: { CurrencyButtons, GeneralStatistics },
  created () {
    this.setCryptoCurrency(this.currency.toUpperCase())
  },
  methods: {
    setCryptoCurrency (crypto) {
      this.$store.commit('SET_CRYPTO', crypto)
    }
  },
  watch: {
    currency () {
      this.setCryptoCurrency(this.currency.toUpperCase())
    },
    '$route.params.currency' () {
      this.setCryptoCurrency(this.currency.toUpperCase())
    }
  }
}
</script>
<style scoped lang="scss">
  .explorer {
    max-height: 100%;
    height: 100%;
    max-width: 100%;
    width: 100%;
    display: flex;
  }

  .search-info-filter {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 100%;
    height: 100%;
  }

  .search-info {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 100%;
    height: 100%;
  }

  .info {
    width: 100%;
  }

  .filter {
    width: 19.6%;
    height: 100%;
    margin-left: 2.2%;
  }

  .fade-enter-active, .fade-leave-active {
    transition: opacity .3s;
  }

  .fade-enter, .fade-leave-to /* .fade-leave-active до версии 2.1.8 */
  {
    opacity: 0;
  }
</style>
