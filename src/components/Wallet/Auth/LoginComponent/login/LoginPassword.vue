<template>
    <div class="col-6">
        <q-card
                class="column justify-center"
                style="width: 420px">
            <q-card-section class="text-center">
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
                    <q-btn @click="loginPassword"
                           color="grey-9"
                           class="full-width q-mt-lg custom-border-radius-5 text-capitalize"
                           :label="$t('registration.enter_my_account')"
                           :disable="invalid && validated || !password || !checkPassword"
                    />
                </ValidationProvider>
            </q-card-section>
        </q-card>
    </div>
</template>

<script>
export default {
  name: 'LoginPassword',
  data () {
    return {
      password: '',
      checkPassword: ''
    }
  },
  methods: {
    loginPassword () {
      this.$emit('loginPassword', this.password)
    }
  }
}
</script>

<style scoped>

</style>
