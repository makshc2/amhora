<template>
  <div class="col-6">
    <q-card
      class="column justify-center"
      style="width: 420px">
      <q-card-section class="text-center">
        <ValidationObserver ref="downloadKeycard">
          <div class="fs-15 q-mb-sm">{{$t('registration.create_password')}}</div>
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
              class="q-pb-sm"
            />
          </ValidationProvider>
          <div class="fs-15 q-mb-sm q-mt-lg">{{$t('registration.confirm_password')}}</div>
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
            <div class="flex items-center full-width justify-start q-mt-md">
              <q-checkbox color="green" class="q-mr-xs" size="xs" v-model="checkBox" :label="$t('registration.check_box')"/>
              <a download="terms" href="">{{$t('registration.terms_of_service')}}</a>
            </div>
            <div class="fs-15 q-mt-lg">{{$t('registration.download_keycard')}}</div>
            <q-btn @click="downloadKeycard"
                   color="grey-9"
                   class="full-width q-mt-md custom-border-radius-5 text-capitalize"
                   :label="$t('registration.download_btn')"
                   :disable="invalid && validated || isComplete && !checkBox"
            />
          </ValidationProvider>
        </ValidationObserver>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
export default {
  name: 'KeyCardPassword',
  data () {
    return {
      password: '',
      checkPassword: '',
      validationPass: true,
      checkBox: false
    }
  },
  props: {
    masterSeed: {
      type: String
    },
    seedPhrase: {
      type: Array
    },
    seedToCheck: {
      type: Array
    }
  },
  computed: {
    isComplete () {
      return this.password && this.checkPassword
    }
  },
  methods: {
    downloadKeycard () {
      this.$emit('downloadKeyCard', this.password)
    }
  }
}
</script>

<style scoped lang="scss">
.link{

}
</style>
