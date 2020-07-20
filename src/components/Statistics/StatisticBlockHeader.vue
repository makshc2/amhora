<template>
  <div class="statistic-block-header">
    <div class="statistic-block-header__main">
      <h3 class="statistic-block-header__title">{{title}}</h3>
      <p class="statistic-block-header__hint">
        {{$t('statistic.last_update') + ' ' +`${date}`}}
      </p>
    </div>
  </div>
</template>
<script>
import moment from 'moment'
export default {
  name: 'StatisticBlockHeader',

  data () {
    return {
      titleKey: '',
      date: moment().format('DD MMMM, LT')
    }
  },
  computed: {
    title () {
      return this.$t('statistic.' + this.$route.name)
    }
  }
}
</script>
