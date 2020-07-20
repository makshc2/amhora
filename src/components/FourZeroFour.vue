<template>
  <div class="middle-part">
    <Breadcrumbs/>
    <div class="content-middle">
      <not-found></not-found>
    </div>
    <general-statistics></general-statistics>
  </div>
</template>
<script>
import GeneralStatistics from './GeneralStatistics.vue'
import NotFound from './NotFound'
import Breadcrumbs from './commonUI/Breadcrumbs'

export default {
  name: 'Wallet',
  components: { Breadcrumbs, GeneralStatistics, NotFound },
  data () {
    return {}
  },
  computed: {},

  methods: {},

  watch: {},

  mounted: function () {
  },
  created: function () {
  }
}
</script>
<style scoped>
  .middle-part{
    padding-top: 40px;
  }
</style>
