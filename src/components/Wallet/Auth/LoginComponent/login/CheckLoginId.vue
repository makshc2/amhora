<template>
    <div class="col-6">
        <q-card
                class="column justify-center"
                style="width: 420px">
            <q-card-section class="text-center">
                <div class="fs-15 q-mb-md">{{$t('login.enter_id')}}</div>
                <q-input filled
                         type="text"
                         v-model.trim="loginId"
                         :error="!!error"
                         :error-messages="error"
                         dense outlined field no-error-icon
                         color="black"
                         @input="$emit('clearErr')"
                />
                <q-slide-transition>
                    <div class="text-red fs-14">{{error}}</div>
                </q-slide-transition>
                <q-btn color="grey-9"
                       class="full-width q-mt-lg custom-border-radius-5 text-capitalize"
                       :label="$t('global.verify')"
                       :disable="!loginId"
                       @click="enterLoginId"
                />
            </q-card-section>
        </q-card>
    </div>
</template>

<script>
export default {
  name: 'CheckLoginId',
  data () {
    return {
      loginId: ''
    }
  },
  props: {
    error: {
      type: String
    },
    loading: {
      type: Boolean
    }
  },
  methods: {
    enterLoginId () {
      this.$emit('enterLoginId', this.loginId)
    }
  }
}
</script>

<style scoped>

</style>
