<template>
  <div class="middle-part">
    <transition name="slide-left">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'Auth'
}
</script>

<style scoped lang="scss">
  .wrapper_login {
    height: 80%;
  }

  .forgot_seed {
    text-decoration: underline;
  }
</style>
