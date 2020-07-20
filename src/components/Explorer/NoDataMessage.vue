<template>
  <div class="container no-data-message">
    {{ message }}
  </div>
</template>

<script>
export default {
  props: {
    message: { type: String, default: 'No data' }
  }
}
</script>

<style scoped>
  .no-data-message {
    text-align: center;
    margin-top: 24px;
    padding: 24px;
    background: transparent;
    border: 1px solid #97979740;
  }
</style>
