<template>
  <div class="flex justify-end full-height">
    <div class="cursor-pointer link-underline">
      <div @click="switchPage">
        {{$t('registration.dont_have_wallet')}}
      </div>
      <div class="q-mt-sm cursor-pointer wrap"
           @click="$router.push({name: 'RecoverAccess'})"
           style="width: 250px"
      >
        {{$t('registration.forgot_seed')}}
      </div>
    </div>
    <div class="wrapper_login flex column justify-center content-center q-mt-xl">
      <div class="text-center fs-18 q-pb-lg">{{$t('login.login')}}</div>
      <q-card v-if="isLoginPage"
              class="column justify-center"
              style="width: 420px">
        <q-card-section class="text-center">
          <q-btn color="grey-9"
                 class="full-width q-mt-md custom-border-radius-5 text-capitalize"
                 :label="$t('registration.recovery_account')"
                 @click="$router.push({name: 'RecoveryAccount'})"/>
          <q-btn color="grey-9"
                 class="full-width color-button q-mt-md custom-border-radius-5 text-capitalize"
                 :label="$t('registration.read_only')"
                 @click="$router.push({name: 'ReadOnlyLogin'})"/>
          <q-btn color="grey-9"
                 class="full-width q-mt-md custom-border-radius-5 text-capitalize"
                 :label="$t('registration.full_access')"
                 @click="$router.push({name: 'Login'})"/>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script>
export default {
  name: 'WelcomePage',
  data () {
    return {
      isLoginPage: true
    }
  },
  methods: {
    switchPage () {
      this.isLoginPage = !this.isLoginPage
      if (!this.isLoginPage) {
        this.$router.push({ name: 'Registration' })
      }
    }
  }
}
</script>

<style scoped>
  .wrapper_login {
    height: 80%;
  }
</style>
