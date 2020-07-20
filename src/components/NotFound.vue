<template>
  <div class="error_content container">
    <h2 class="err-title">404</h2>
    <span class="hint">
      {{$t('error_msg.not_found')}}
    </span>
  </div>
</template>
<script>

export default {
  name: 'Error',
  components: { }
}
</script>
<style scoped lang="scss">
  .middle-part{
    padding-top: 40px;
  }
  .err-title{
    font-size: 28px;
    font-weight: 500;
    letter-spacing: -0.49px;
    margin-bottom: 40px;
  }
</style>
