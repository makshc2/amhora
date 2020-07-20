<template>
  <div class="col-6">
    <q-card
      class="column justify-center"
      style="width: 420px">
      <q-card-section class="text-center">
        <ValidationObserver ref="setSessionPassword">
          <div class="fs-15 q-mb-sm">{{$t('registration.login')}}</div>
            <q-input
              v-model="login"
              filled
              disable
              class="q-mb-lg"
              :label="$t('global.login')"
              dense outlined field no-error-icon
              color="black"
            />
          <div class="fs-15 q-mb-sm">{{$t('registration.session_password')}}</div>
          <ValidationProvider
            tag="div"
            name="confirmation"
            class="relative-position"
            mode="lazy"
            rules="required|password"
            v-slot="{ errors, reset, invalid, validated}">
            <q-input
              filled
              @focus="reset"
              type="password"
              :error="invalid && validated"
              :error-message="errors[0]"
              autocomplete="new-password"
              dense outlined field no-error-icon
              color="black"
              v-model="password"
              :label="$t('global.password')"
              class="q-pb-lg"
            />
          </ValidationProvider>
          <div class="fs-15 q-mb-sm q-mt-md">{{$t('registration.confirm_session_password')}}</div>
          <ValidationProvider
            rules="required|confirmed:confirmation|password"
            v-slot="{ errors, invalid, validated }">
            <q-input
              filled
              type="password"
              :error="invalid && validated"
              :error-message="errors[0]"
              autocomplete="new-password"
              dense outlined field no-error-icon
              color="black"
              v-model="checkPassword"
              :label="$t('global.password')"
            />
            <q-btn @click="setSessionPassword"
                   color="grey-9"
                   class="full-width q-mt-lg custom-border-radius-5 text-capitalize"
                   :label="$t('registration.enter_my_account')"
                   :disable="invalid && validated || !login || !password || !checkPassword"
            />
          </ValidationProvider>
        </ValidationObserver>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
export default {
  name: 'PasswordCurrentSession',
  data () {
    return {
      password: '',
      checkPassword: ''
    }
  },
  props: {
    login: {
      type: String
    }
  },
  methods: {
    setSessionPassword () {
      this.$emit('sessionPassword', this.password, this.login)
    }
  }
}
</script>

<style scoped>

</style>
