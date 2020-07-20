<template>
  <div class="middle-part">
    <div class="container wrapper_login avenir-font-family flex justify-center content-center q-mt-xl">
      <q-slide-transition class="full-width">
        <router-view></router-view>
      </q-slide-transition>
    </div>
    <general-statistics></general-statistics>
  </div>
</template>
<script>
import GeneralStatistics from '../GeneralStatistics.vue'

export default {
  name: 'Wallet',
  components: {
    GeneralStatistics
  }
}
</script>

<style scoped lang="scss">
  .wrapper_login{
    height: 50%;
  }
</style>
