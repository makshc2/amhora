<template>
  <div class="content-footer container">
    <div class="general-statistics">
      <div class="general-statistics-hint">
        <img src="@/assets/resources/icons/spinner.svg" alt="spinner">
        <span>
          {{$t('market.displaying_real_time_transactions')}}
        </span>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'MarketFooter'
}
</script>
